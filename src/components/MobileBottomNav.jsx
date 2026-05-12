import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layout, ClipboardList, GraduationCap, Users, HelpCircle, Link2 } from 'lucide-react';


/**
 * MobileBottomNav - Bottom navigation bar for mobile pages
 * Shared across: LinkShortener, QuizMaker, Chronicles
 * Uses useLocation() to auto-highlight the current page
 */
const MobileBottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (href) => {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  };

  const navItems = [
    { to: '/',           icon: <Home size={20} />,          label: 'TRANG CHỦ',  isLink: true },
    { to: '/#about',     icon: <Layout size={20} />,         label: 'GIỚI THIỆU', isLink: false },
    { to: '/chronicles', icon: <ClipboardList size={20} />,  label: 'HÀNH TRÌNH', isLink: true },
    { to: '/#skills',    icon: <GraduationCap size={20} />,  label: 'KỸ NĂNG',    isLink: false },
    { to: '/blog',       icon: <Users size={20} />,          label: 'BÀI VIẾT',   isLink: true },
    { to: '/shortener',  icon: <Link2 size={20} />,          label: 'RÚT GỌN',    isLink: true },
    { to: '/quiz-maker', icon: <HelpCircle size={20} />,     label: 'QUIZ',       isLink: true },
  ];


  return (
    <div className="iris-mobile-nav">
      {navItems.map((item) => {
        const active = isActive(item.to.split('#')[0]);

        if (item.isLink) {
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`m-nav-item${active ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        }

        return (
          <a
            key={item.to}
            href={item.to}
            className="m-nav-item"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
