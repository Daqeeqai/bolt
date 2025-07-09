import React, { useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  Users, 
  Brain, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  id: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

/**
 * Individual sidebar menu item component
 * Handles active states, hover effects, and collapsed view
 */
const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  id, 
  isActive, 
  isCollapsed,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full flex items-center rounded-xl transition-all duration-300 ease-out",
        "hover:bg-gray-50 active:scale-[0.98]",
        isCollapsed ? "justify-center p-3 mx-2" : "px-4 py-3 mx-3",
        isActive 
          ? "bg-gradient-to-r from-[#ED1C24]/10 to-[#ED1C24]/5 text-[#ED1C24] shadow-sm border-l-4 border-[#ED1C24]" 
          : "text-gray-600 hover:text-gray-900"
      )}
      aria-label={isCollapsed ? label : undefined}
      role="menuitem"
    >
      <div className={cn(
        "flex items-center justify-center rounded-lg transition-all duration-300",
        isActive 
          ? "bg-[#ED1C24]/10 text-[#ED1C24]" 
          : "text-gray-500 group-hover:text-gray-700 group-hover:bg-gray-100",
        isCollapsed ? "w-10 h-10" : "w-9 h-9 mr-3"
      )}>
        <Icon size={isCollapsed ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      
      {/* Label with smooth fade transition */}
      <span className={cn(
        "font-medium text-sm transition-all duration-300 ease-out",
        isCollapsed 
          ? "opacity-0 scale-95 w-0 overflow-hidden" 
          : "opacity-100 scale-100 flex-1 text-left"
      )}>
        {label}
      </span>

      {/* Active indicator dot */}
      {isActive && (
        <div className={cn(
          "w-2 h-2 bg-[#ED1C24] rounded-full transition-all duration-300",
          isCollapsed ? "absolute -right-1 top-1/2 -translate-y-1/2" : "ml-auto"
        )} />
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
          {label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </button>
  );
};

/**
 * Main Sidebar Component
 * Features smooth toggle animation, modern design, and accessibility support
 */
export const Sidebar: React.FC = () => {
  const { sidebarOpen, activeView, setSidebarOpen, setActiveView } = useAppStore();
  const [logoError, setLogoError] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'conversations', label: 'AI Conversations', icon: MessageCircle },
    { id: 'travelers', label: 'Traveler Management', icon: Users },
    { id: 'training', label: 'AI Training', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/80",
        "transition-all duration-400 ease-out z-50 shadow-xl shadow-gray-900/5",
        sidebarOpen ? "w-72" : "w-20"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header Section */}
      <div className={cn(
        "relative flex items-center border-b border-gray-100/80 bg-white/50",
        sidebarOpen ? "px-6 py-5 justify-between" : "px-4 py-5 justify-center"
      )}>
        {/* Logo and Brand */}
        <div className={cn(
          "flex items-center transition-all duration-400 ease-out",
          sidebarOpen ? "space-x-4" : "justify-center"
        )}>
          {/* Logo Container */}
          <div className={cn(
            "relative flex items-center justify-center rounded-2xl overflow-hidden",
            "bg-gradient-to-br from-[#ED1C24] to-[#C41E3A] shadow-lg",
            "transition-all duration-400 ease-out",
            sidebarOpen ? "w-12 h-12" : "w-11 h-11"
          )}>
            {!logoError ? (
              <img
                src="/src/assets/mw-logo.jpg"
                alt="Magic World Logo"
                className="w-full h-full object-cover"
                onError={handleLogoError}
                loading="lazy"
              />
            ) : (
              // Fallback icon if logo fails to load
              <div className="w-6 h-6 text-white font-bold flex items-center justify-center">
                MW
              </div>
            )}
          </div>
          
          {/* Brand Text */}
          <div className={cn(
            "transition-all duration-400 ease-out",
            sidebarOpen 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-4 w-0 overflow-hidden"
          )}>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Magic World
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              AI Agent Dashboard
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={cn(
            "flex items-center justify-center rounded-xl transition-all duration-300",
            "hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20",
            sidebarOpen 
              ? "w-9 h-9 text-gray-500 hover:text-gray-700" 
              : "absolute -right-4 w-8 h-8 bg-white border border-gray-200 shadow-lg text-gray-600 hover:text-[#ED1C24] hover:border-[#ED1C24]/20"
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <ChevronLeft size={18} strokeWidth={2.5} />
          ) : (
            <ChevronRight size={16} strokeWidth={2.5} />
          )}
        </button>
      </div>
      
      {/* Navigation Menu */}
      <nav 
        className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        role="menu"
      >
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              id={item.id}
              isActive={activeView === item.id}
              isCollapsed={!sidebarOpen}
              onClick={() => setActiveView(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className={cn(
        "border-t border-gray-100/80 bg-white/50 transition-all duration-400",
        sidebarOpen ? "px-6 py-4" : "px-4 py-4"
      )}>
        <div className={cn(
          "flex items-center text-xs text-gray-500 transition-all duration-400",
          sidebarOpen ? "justify-between" : "justify-center"
        )}>
          <span className={cn(
            "transition-all duration-400",
            sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            v2.1.0
          </span>
          <div className={cn(
            "w-2 h-2 rounded-full bg-green-400 transition-all duration-400",
            sidebarOpen ? "" : "mx-auto"
          )} 
          title="System Online" 
          />
        </div>
      </div>
    </aside>
  );
};