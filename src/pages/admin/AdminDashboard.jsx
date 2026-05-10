import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, User, Lock, Mail, Globe, Monitor, Smartphone, 
  Activity, Save, LogOut, ChevronRight, Plus, Trash2, Edit, 
  ExternalLink, CheckCircle, Clock, Eye, TrendingUp, BarChart3,
  MessageSquare, Image as ImageIcon, Upload, Key, Brain, Zap,
  X, Unlock, FileText, Crop, Search, QrCode, Filter, Trophy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { 
  collection, doc, getDoc, updateDoc, getDocs, 
  query, where, deleteDoc, setDoc, orderBy, limit 
} from 'firebase/firestore';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

// --- SUB-COMPONENTS (FOR BUILD STABILITY) ---

const MaintenanceTab = ({ localConfig, updateNested }) => (
  <motion.div key="maintenance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="config-section">
    <div className="manager-header" style={{ marginBottom: '2.5rem' }}>
       <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--accent-main)', alignItems: 'center' }}>
          <Lock size={24} />
          <h3 style={{ fontSize: '1.4rem', letterSpacing: '2px' }}>QUẢN LÝ TRẠNG THÁI & TRUY CẬP</h3>
       </div>
       <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Bật chế độ bảo trì cho từng phần của website hoặc quản lý danh sách chặn truy cập bằng điện thoại.</p>
    </div>

    <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(10,10,10,0.4)', borderRadius: '24px', marginBottom: '2.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {['blog', 'chronicles', 'about', 'skills'].map((key) => (
          <div key={key} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--accent-main)', letterSpacing: '1px' }}>
                {key === 'blog' ? 'CHẾ ĐỘ BLOG' : key === 'chronicles' ? 'CHRONICLES' : key.toUpperCase()}
              </span>
              {localConfig.maintenance?.[key] ? <Lock size={18} color="#ff4d4d" /> : <Unlock size={18} color="#00ffcc" />}
            </div>
            <button 
              className="add-btn"
              style={{ 
                background: localConfig.maintenance?.[key] ? 'rgba(255, 77, 77, 0.1)' : 'rgba(0, 255, 204, 0.1)',
                color: localConfig.maintenance?.[key] ? '#ff4d4d' : '#00ffcc',
                border: '1px solid currentColor',
                padding: '0.8rem'
              }}
              onClick={() => updateNested('maintenance', key, !localConfig.maintenance?.[key])}
            >
              {localConfig.maintenance?.[key] ? 'ĐANG BẢO TRÌ' : 'ĐANG HOẠT ĐỘNG'}
            </button>
          </div>
        ))}
      </div>
    </div>

    <div className="manager-header" style={{ marginBottom: '1.5rem' }}>
       <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--accent-main)', alignItems: 'center' }}>
          <Smartphone size={24} />
          <h3 style={{ fontSize: '1.4rem', letterSpacing: '2px' }}>MOBILE ACCESS CONTROL</h3>
       </div>
    </div>

    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Danh sách các đường dẫn (URL) sẽ bị chặn khi truy cập bằng điện thoại. 
          Lưu ý: Trang chủ <code>{"/"}</code> và các trang Quiz <code>{"/quiz"}</code> luôn được quản lý riêng.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
           <input 
             type="text" 
             id="new-mobile-path"
             placeholder="Nhập đường dẫn cần chặn (vd: /skills)..." 
             style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && e.target.value.trim()) {
                  const val = e.target.value.trim();
                  const current = localConfig.maintenance?.mobileBlockedPaths || [];
                  if (!current.includes(val)) updateNested('maintenance', 'mobileBlockedPaths', [...current, val]);
                  e.target.value = '';
               }
             }}
           />
           <button className="add-btn" onClick={() => {
              const el = document.getElementById('new-mobile-path');
              const val = el.value.trim();
              if (val) {
                const current = localConfig.maintenance?.mobileBlockedPaths || [];
                if (!current.includes(val)) updateNested('maintenance', 'mobileBlockedPaths', [...current, val]);
                el.value = '';
              }
           }}>THÊM PATH</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {(localConfig.maintenance?.mobileBlockedPaths || []).map(path => (
            <div key={path} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
              <Lock size={14} />
              <span style={{ fontWeight: 600 }}>{path}</span>
              <X size={16} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => updateNested('maintenance', 'mobileBlockedPaths', (localConfig.maintenance.mobileBlockedPaths || []).filter(p => p !== path))} />
            </div>
          ))}
        </div>
      </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { config, updateConfig } = useConfig();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [localConfig, setLocalConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [quizzesList, setQuizzesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Modals/Adjusters
  const [userModal, setUserModal] = useState({ isOpen: false, mode: 'add', data: {} });

  useEffect(() => {
    if (config) setLocalConfig(JSON.parse(JSON.stringify(config)));
  }, [config]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const qA = query(collection(db, 'system_analytics'), orderBy('timestamp', 'desc'), limit(100));
      const sA = await getDocs(qA);
      setAnalyticsData(sA.docs.map(d => ({ id: d.id, ...d.data() })));

      const sQ = await getDocs(collection(db, 'quizzes'));
      setQuizzesList(sQ.docs.map(d => ({ id: d.id, ...d.data() })));

      const sU = await getDocs(collection(db, 'users'));
      setUsersList(sU.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateNested = (cat, field, val) => {
    setLocalConfig(prev => ({ ...prev, [cat]: { ...prev[cat], [field]: val } }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig(localConfig);
      alert('Đã cập nhật hệ thống thành công!');
    } catch (e) { alert(e.message); }
    setIsSaving(false);
  };

  const logout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!localConfig) return <div className="admin-loading">Initializing BCT System...</div>;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header" style={{ padding: '0 2rem', marginBottom: '2rem' }}>
           {currentUser?.photoURL ? (
             <img src={currentUser.photoURL} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '1rem', border: '2px solid var(--accent-main)' }} />
           ) : (
             <img src="/logobct.png" alt="logo" style={{ width: '40px', marginBottom: '1rem' }} />
           )}
           <div style={{ color: 'var(--accent-main)', fontWeight: 'bold', fontSize: '0.8rem' }}>BCT SYSTEM V1.0</div>
        </div>

        <nav className="admin-nav">
          {[
            { id: 'analytics', label: 'THỐNG KÊ TRAFFIC', icon: <Activity size={18} /> },
            { id: 'quizzes', label: 'QUẢN LÝ BÀI THI', icon: <Trophy size={18} /> },
            { id: 'users', label: 'QUẢN LÝ USER', icon: <User size={18} /> },
            { id: 'integrations', label: 'DỊCH VỤ & API', icon: <Key size={18} /> },
            { id: 'maintenance', label: 'BẢO TRÌ & MOBILE', icon: <Lock size={18} /> }
          ].map(tab => (
            <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-footer-btn">
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
            <Save size={18} /> {isSaving ? 'ĐANG LƯU...' : 'LƯU CẤU HÌNH'}
          </button>
          <button className="logout-btn" style={{ width: '100%', marginTop: '1rem', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer' }} onClick={logout}>
            <LogOut size={18} /> ĐĂNG XUẤT
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-frame glass-panel">
          <AnimatePresence mode="wait">
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="config-section">
                <h3>TRAFFIC ANALYSIS</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>LƯỢT TRUY CẬP HỆ THỐNG</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-main)' }}>{analyticsData.length}</div>
                  </div>
                </div>
                <div className="glass-panel" style={{ marginTop: '2rem', padding: '0', overflow: 'hidden' }}>
                  <table className="admin-table">
                    <thead><tr><th>Sự kiện</th><th>Đường dẫn</th><th>Thời gian</th></tr></thead>
                    <tbody>
                      {analyticsData.map(ev => (
                        <tr key={ev.id}>
                          <td>{ev.event}</td>
                          <td><code>{ev.path}</code></td>
                          <td style={{ opacity: 0.6, fontSize: '0.8rem' }}>{ev.timestamp?.toDate().toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'quizzes' && (
              <motion.div key="quizzes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="config-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h3>DANH SÁCH BÀI THI</h3>
                  <button className="add-btn" onClick={() => navigate('/quiz-maker')}><Plus size={18}/> TẠO BÀI THI</button>
                </div>
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                  <table className="admin-table">
                    <thead><tr><th>Tên bài thi</th><th>Mã Slug</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
                    <tbody>
                      {quizzesList.map(q => (
                        <tr key={q.id}>
                          <td>{q.title}</td>
                          <td><code>{q.slug}</code></td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="icon-btn" onClick={() => navigate('/quiz-maker')}><Edit size={14}/></button>
                            <button className="icon-btn danger" onClick={async () => { if(confirm('Xóa bài thi?')) await deleteDoc(doc(db,'quizzes',q.id)); fetchData(); }}><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="config-section">
                <h3>QUẢN LÝ TÀI KHOẢN</h3>
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginTop: '2rem' }}>
                  <table className="admin-table">
                    <thead><tr><th>User</th><th>Email</th><th>Quyền</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
                    <tbody>
                      {usersList.map(u => (
                        <tr key={u.id}>
                          <td>{u.displayName}</td>
                          <td>{u.email}</td>
                          <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="icon-btn" onClick={() => setUserModal({ isOpen: true, mode: 'edit', data: u })}><Edit size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'integrations' && (
              <motion.div key="integrations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="config-section">
                <h3>DỊCH VỤ & API</h3>
                <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                  <label>GEMINI API KEY</label>
                  <input type="password" value={localConfig.integrations?.geminiKey || ''} onChange={e => updateNested('integrations', 'geminiKey', e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: '#fff', borderRadius: '12px', marginTop: '0.5rem' }} />
                </div>
              </motion.div>
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceTab localConfig={localConfig} updateNested={updateNested} />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MODAL USER CRUD */}
      {userModal.isOpen && (
        <div className="admin-modal-overlay">
           <div className="admin-modal-card">
              <button className="modal-close" onClick={() => setUserModal({ isOpen: false, mode: 'add', data: {} })}><X size={20} /></button>
              <h2>CHỈNH SỬA HỒ SƠ</h2>
              <form onSubmit={async (e) => { e.preventDefault(); await setDoc(doc(db,'users',userModal.data.id), userModal.data, {merge:true}); setUserModal({isOpen:false, mode:'add', data:{}}); fetchData(); }} className="modal-form">
                 <div className="field"><label>TÊN HIỂN THỊ</label><input type="text" value={userModal.data.displayName || ''} onChange={e => setUserModal({...userModal, data:{...userModal.data, displayName:e.target.value}})} required /></div>
                 <div className="field"><label>EMAIL</label><input type="email" value={userModal.data.email || ''} onChange={e => setUserModal({...userModal, data:{...userModal.data, email:e.target.value}})} required /></div>
                 <button type="submit" className="save-btn">LƯU DỮ LIỆU</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
