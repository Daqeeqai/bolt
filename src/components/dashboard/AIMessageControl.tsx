import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Users, 
  MessageSquare,
  Search,
  Zap,
  Globe,
  Clock,
  Sparkles,
  Target,
  Filter,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Ticket,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DatabaseService } from '@/lib/database';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AIMessageControl: React.FC = () => {
  const { travelers, feedback, loadTravelers, loadFeedback } = useAppStore();
  const [activeTab, setActiveTab] = useState<'compose' | 'feedback'>('compose');
  const [messageType, setMessageType] = useState<'manual' | 'bulk'>('manual');
  const [selectedTravelers, setSelectedTravelers] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState('all');
  const [manualRecipient, setManualRecipient] = useState('');
  const [sending, setSending] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadTravelers();
    loadFeedback();
  }, [loadTravelers, loadFeedback]);

  const filteredTravelers = travelers.filter(traveler => {
    const matchesSearch = traveler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         traveler.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDestination = filterDestination === 'all' || traveler.destination === filterDestination;
    return matchesSearch && matchesDestination;
  });

  const destinations = [...new Set(travelers.map(t => t.destination))];

  const handleSendMessage = async (type: 'manual' | 'bulk') => {
    if (!messageContent.trim()) return;
    
    setSending(true);
    try {
      // In a real implementation, this would send messages via an API
      console.log('Sending message:', {
        type,
        recipients: type === 'manual' ? [manualRecipient] : selectedTravelers,
        content: messageContent,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setMessageContent('');
      setSelectedTravelers([]);
      setManualRecipient('');
      
      // Show success message (you could use a toast here)
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateFeedback = async (feedbackId: string, updates: any) => {
    try {
      await DatabaseService.updateFeedback(feedbackId, updates);
      loadFeedback(); // Reload feedback data
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const quickActions = [
    { 
      label: 'Check-in Reminder', 
      icon: Clock, 
      color: 'from-blue-500 to-blue-600',
      description: 'Send automated check-in messages'
    },
    { 
      label: 'Weather Alert', 
      icon: Globe, 
      color: 'from-orange-500 to-orange-600',
      description: 'Broadcast weather updates'
    },
    { 
      label: 'Emergency Broadcast', 
      icon: Zap, 
      color: 'from-[#ED1C24] to-[#C41E3A]',
      description: 'Send urgent notifications'
    },
  ];

  const stats = {
    complaints: feedback.filter(item => item.type === 'complaint').length,
    suggestions: feedback.filter(item => item.type === 'suggestion').length,
    tickets: feedback.filter(item => item.type === 'ticket').length,
    urgent: feedback.filter(item => item.priority === 'urgent').length,
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'compose'
                  ? 'bg-gradient-to-r from-[#ED1C24] to-[#C41E3A] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare size={18} />
                <span>Message Composer</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'feedback'
                  ? 'bg-gradient-to-r from-[#ED1C24] to-[#C41E3A] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target size={18} />
                <span>Feedback Center</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'compose' && (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Composer */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ED1C24] to-[#C41E3A] rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Message Composer</h2>
                  <p className="text-gray-600">Craft personalized messages with AI assistance</p>
                </div>
              </div>

              {/* Message Type Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gray-100 rounded-2xl p-1">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setMessageType('manual')}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        messageType === 'manual'
                          ? 'bg-white text-gray-900 shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>Manual Message</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setMessageType('bulk')}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        messageType === 'bulk'
                          ? 'bg-white text-gray-900 shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Users size={16} />
                        <span>Bulk Communication</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {messageType === 'manual' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <User size={16} />
                        <span>Select Traveler</span>
                      </label>
                      <Select value={manualRecipient} onValueChange={setManualRecipient}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-[#ED1C24] focus:ring-[#ED1C24]">
                          <SelectValue placeholder="Choose a traveler..." />
                        </SelectTrigger>
                        <SelectContent>
                          {travelers.map(traveler => (
                            <SelectItem key={traveler.id} value={traveler.id}>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <User size={14} className="text-gray-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{traveler.name}</div>
                                    <div className="text-xs text-gray-500">{traveler.email}</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="ml-4">
                                  {traveler.destination}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Sparkles size={16} />
                        <span>AI Suggestions</span>
                      </label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Welcome Message
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Check-in
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Support
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <MessageSquare size={16} />
                      <span>Message Content</span>
                    </label>
                    <Textarea
                      placeholder="Craft your personalized message here..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className="min-h-32 border-gray-200 focus:border-[#ED1C24] focus:ring-[#ED1C24] resize-none"
                    />
                  </div>

                  <Button 
                    onClick={() => handleSendMessage('manual')}
                    disabled={sending || !messageContent.trim() || !manualRecipient}
                    className="w-full h-12 bg-gradient-to-r from-[#ED1C24] to-[#C41E3A] hover:from-[#C41E3A] hover:to-[#A01B2E] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {sending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Manual Message
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Search size={16} />
                        <span>Search Travelers</span>
                      </label>
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 border-gray-200 focus:border-[#ED1C24] focus:ring-[#ED1C24]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Filter size={16} />
                        <span>Filter by Destination</span>
                      </label>
                      <Select value={filterDestination} onValueChange={setFilterDestination}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-[#ED1C24] focus:ring-[#ED1C24]">
                          <SelectValue placeholder="All destinations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Destinations</SelectItem>
                          {destinations.map(dest => (
                            <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {filteredTravelers.map(traveler => (
                        <div
                          key={traveler.id}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedTravelers.includes(traveler.id)
                             ? 'bg-gradient-to-r from-[#ED1C24]/10 to-[#ED1C24]/20 border-2 border-[#ED1C24]/30 shadow-md'
                              : 'bg-white hover:bg-gray-50 border border-gray-200'
                          }`}
                          onClick={() => {
                            setSelectedTravelers(prev =>
                              prev.includes(traveler.id)
                                ? prev.filter(id => id !== traveler.id)
                                : [...prev, traveler.id]
                            );
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedTravelers.includes(traveler.id)
                                  ? 'bg-[#ED1C24] text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <User size={16} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{traveler.name}</div>
                                <div className="text-sm text-gray-600 flex items-center space-x-2">
                                  <MapPin size={12} />
                                  <span>{traveler.destination}</span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={traveler.status === 'traveling' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {traveler.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 flex items-center space-x-3">
                    <Users size={20} className="text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {selectedTravelers.length} travelers selected for bulk communication
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <MessageSquare size={16} />
                      <span>Bulk Message Content</span>
                    </label>
                    <Textarea
                      placeholder="Compose your bulk message here..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className="min-h-32 border-gray-200 focus:border-[#ED1C24] focus:ring-[#ED1C24] resize-none"
                    />
                  </div>

                  <Button 
                    onClick={() => handleSendMessage('bulk')}
                    disabled={sending || !messageContent.trim() || selectedTravelers.length === 0}
                    className="w-full h-12 bg-gradient-to-r from-[#ED1C24] to-[#C41E3A] hover:from-[#C41E3A] hover:to-[#A01B2E] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {sending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send to {selectedTravelers.length} Travelers
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ED1C24] to-[#C41E3A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stats.complaints}</div>
                    <div className="text-sm font-medium text-gray-600">Complaints</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stats.suggestions}</div>
                    <div className="text-sm font-medium text-gray-600">Suggestions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Ticket size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stats.tickets}</div>
                    <div className="text-sm font-medium text-gray-600">Support Tickets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stats.urgent}</div>
                    <div className="text-sm font-medium text-gray-600">Urgent Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback List */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ED1C24] to-[#C41E3A] rounded-xl flex items-center justify-center">
                    <Target size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Feedback Center</h2>
                    <p className="text-gray-600">Monitor and respond to traveler feedback</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search feedback..."
                      className="pl-10 w-64 border-gray-200 focus:border-[#ED1C24] focus:ring-[#ED1C24]"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-200">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {feedback.map(item => {
                  const getTypeIcon = (type: string) => {
                    switch (type) {
                      case 'complaint': return AlertTriangle;
                      case 'suggestion': return Lightbulb;
                      case 'ticket': return Ticket;
                      default: return MessageSquare;
                    }
                  };

                  const getTypeColor = (type: string) => {
                    switch (type) {
                      case 'complaint': return 'from-[#ED1C24] to-[#C41E3A]';
                      case 'suggestion': return 'from-blue-500 to-blue-600';
                      case 'ticket': return 'from-purple-500 to-purple-600';
                      default: return 'from-gray-500 to-gray-600';
                    }
                  };

                  const getPriorityColor = (priority: string) => {
                    switch (priority) {
                      case 'urgent': return 'bg-[#ED1C24]/10 text-[#ED1C24] border-[#ED1C24]/30';
                      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
                      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                      case 'low': return 'bg-green-100 text-green-800 border-green-200';
                      default: return 'bg-gray-100 text-gray-800 border-gray-200';
                    }
                  };

                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'open': return 'bg-[#ED1C24]/10 text-[#ED1C24] border-[#ED1C24]/30';
                      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
                      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
                      default: return 'bg-gray-100 text-gray-800 border-gray-200';
                    }
                  };

                  const getSentimentColor = (score: number) => {
                    if (score >= 0.7) return 'text-green-600';
                    if (score >= 0.4) return 'text-yellow-600';
                    return 'text-[#ED1C24]';
                  };

                  const TypeIcon = getTypeIcon(item.type);
                  
                  return (
                    <div
                      key={item.id}
                      className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(item.type)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <TypeIcon size={18} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.subject}</h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <User size={14} />
                                <span>Traveler #{item.traveler_id.slice(0, 8)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getPriorityColor(item.priority)} border font-medium`}>
                            {item.priority}
                          </Badge>
                          <Badge className={`${getStatusColor(item.status)} border font-medium`}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{item.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600">Sentiment:</span>
                            <span className={`font-semibold ${getSentimentColor(item.sentiment_score)}`}>
                              {(item.sentiment_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {item.status === 'open' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => handleUpdateFeedback(item.id, { status: 'resolved' })}
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Resolve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() => handleUpdateFeedback(item.id, { status: 'in_progress' })}
                              >
                                <User size={14} className="mr-1" />
                                Assign
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline" className="border-gray-200 hover:bg-gray-50">
                            View Details
                            <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};