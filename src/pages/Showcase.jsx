import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, Github, Code, Sparkles, Box, Layout as LayoutIcon, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';

const Showcase = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Clean, empty slate for future projects
  const projects = [
    {
      id: 1,
      title: "Project Alpha",
      description: "A placeholder for your future innovation. This space is ready for your next big idea.",
      tech: ["React", "AI", "Cloud"],
      status: "Stable",
      icon: <Sparkles size={24} />,
      color: "var(--accent-main)"
    },
    {
      id: 2,
      title: "Core System v4",
      description: "Next generation architecture for seamless digital experiences and intelligent automation.",
      tech: ["Next.js", "Python", "Edge"],
      status: "In Development",
      icon: <Cpu size={24} />,
      color: "var(--accent-secondary)"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '100px' }}>
      {/* Header Section */}
      <section style={{ 
        padding: '8rem 2rem 4rem', 
        textAlign: 'center', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '80vw', height: '60vh',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          opacity: 0.1, zIndex: 0, filter: 'blur(100px)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              onClick={() => navigate('/')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                color: 'var(--text-secondary)', background: 'transparent',
                cursor: 'pointer', marginBottom: '2rem',
                fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '30px',
                border: '1px solid var(--bg-glass-border)', margin: '0 auto 2rem'
              }}
            >
              <ArrowLeft size={16} /> QUAY LẠI TRANG CHỦ
            </button>
            <h1 className="text-gradient" style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
              fontFamily: 'Chakra Petch',
              marginBottom: '1rem'
            }}>
              {t('utilities.gallery_title', '< PHÒNG TRƯNG BÀY />')}
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              maxWidth: '700px', 
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}>
              {t('utilities.gallery_subtitle', 'Nơi hội tụ những ý tưởng kỹ thuật số và các công trình kiến trúc mã nguồn đầy tâm huyết.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container" style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel"
              style={{
                padding: '2.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}
              whileHover={{ 
                transform: 'translateY(-10px)',
                borderColor: project.color
              }}
            >
              {/* Top Accent */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(to right, transparent, ${project.color}, transparent)`,
                opacity: 0.5
              }} />

              {/* Icon & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: project.color, boxShadow: `0 0 20px ${project.color}22`
                }}>
                  {project.icon}
                </div>
                <span style={{ 
                  fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px',
                  color: project.color, background: `${project.color}11`,
                  padding: '4px 10px', borderRadius: '4px', border: `1px solid ${project.color}33`
                }}>
                  {project.status.toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', fontFamily: 'Chakra Petch' }}>
                  {project.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {project.description}
                </p>
              </div>

              {/* Tech Tags */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {project.tech.map((tag, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.75rem', color: 'var(--text-muted)', 
                    background: 'rgba(255,255,255,0.05)', padding: '4px 10px', 
                    borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <button 
                  disabled
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', cursor: 'not-allowed',
                    fontSize: '0.85rem'
                  }}
                >
                  <Github size={16} /> CODE
                </button>
                <button 
                  disabled
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.8rem', borderRadius: '8px', border: 'none',
                    background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', cursor: 'not-allowed',
                    fontSize: '0.85rem', fontWeight: 600
                  }}
                >
                  <ExternalLink size={16} /> LIVE
                </button>
              </div>
            </motion.div>
          ))}

          {/* Empty Slot / Add More Vibe */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.5 }}
             className="glass-panel"
             style={{
               border: '2px dashed rgba(255,255,255,0.1)',
               display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
               padding: '3rem', textAlign: 'center', background: 'transparent'
             }}
          >
             <Box size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
             <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Đang chờ dự án tiếp theo...
             </p>
          </motion.div>
        </div>
      </section>

      <MobileBottomNav />
    </div>
  );
};

export default Showcase;
