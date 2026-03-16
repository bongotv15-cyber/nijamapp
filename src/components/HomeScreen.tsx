import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../AppContext';
import { Customer } from '../types';
import { formatAmountBng, toBngDigits } from '../utils';
import { 
  Store, Bell, UserPlus, Contact, FileText, Calendar, TrendingUp, Send, 
  CloudUpload, Settings, Filter, Download, X, Home, Plus, MoreVertical 
} from 'lucide-react';

const FeatureItem = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick: () => void }) => (
  <div className="flex flex-col items-center text-[#444] cursor-pointer transition-transform duration-200 active:scale-95" onClick={onClick}>
    <div className="bg-transparent text-primary h-[38px] flex justify-center items-center text-[34px] mb-1.5">
      {icon}
    </div>
    <p className="text-[11px] font-semibold text-center leading-[1.3] whitespace-nowrap" dangerouslySetInnerHTML={{ __html: text }}></p>
  </div>
);

export default function HomeScreen() {
  const { appData, setCurrentScreen, setActivePhone, setIsEditMode, showToast, updateAppData } = useAppContext();
  const [isHideUIMode, setIsHideUIMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('new');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (listRef.current && listRef.current.scrollTop > 10) {
      setIsHideUIMode(true);
    }
  };

  const clearSearchMode = () => {
    setSearchTerm('');
    setIsHideUIMode(false);
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  const openAddScreen = () => {
    setIsEditMode(false);
    setActivePhone(null);
    setCurrentScreen('add');
  };

  const openTransactionScreen = (phone: string) => {
    setActivePhone(phone);
    setCurrentScreen('transaction');
  };

  const appAction = (action: string) => {
    if (action === 'ব্যাকআপ') {
      const choice = window.confirm("ডেটা সেভ (ডাউনলোড) করতে 'OK' চাপুন। \nআগের ডেটা রিস্টোর করতে 'Cancel' চাপুন।");
      if (choice) {
        exportBackup();
      } else {
        document.getElementById('importFile')?.click();
      }
    } else {
      showToast(action + ' অপশনটি শীঘ্রই আসছে!', 'info');
    }
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "NizamStore_Offline_Backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
    showToast('ব্যাকআপ ডাউনলোড হয়েছে!', 'success');
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.customers && importedData.transactions) {
          updateAppData(importedData);
          showToast('ডেটা রিস্টোর সফল হয়েছে!', 'success');
        } else throw new Error("Invalid Format");
      } catch (err) {
        showToast('ভুল ফাইল ফরম্যাট!', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const downloadPDF = () => {
    showToast('পিডিএফ তৈরি হচ্ছে...', 'info');
    setTimeout(() => window.print(), 300);
  };

  const customersList = useMemo(() => {
    let list = Object.values(appData.customers) as Customer[];
    
    if (filterType !== 'all') {
      list = list.filter(c => c.type === filterType);
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(lowerSearch) || 
        c.phone.toLowerCase().includes(lowerSearch)
      );
    }

    list.sort((a, b) => {
      if (sortType === 'new') return b.time - a.time;
      if (sortType === 'old') return a.time - b.time;
      if (sortType === 'high') return b.amount - a.amount;
      if (sortType === 'low') return a.amount - b.amount;
      return b.time - a.time;
    });

    return list;
  }, [appData.customers, filterType, searchTerm, sortType]);

  const totalDue = useMemo(() => (Object.values(appData.customers) as Customer[]).filter(c => c.type === 'customer').reduce((acc, c) => acc + c.amount, 0), [appData.customers]);
  const totalGive = useMemo(() => (Object.values(appData.customers) as Customer[]).filter(c => c.type === 'supplier').reduce((acc, c) => acc + c.amount, 0), [appData.customers]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      <input type="file" id="importFile" className="hidden" accept=".json" onChange={importBackup} />
      
      <header className={`bg-primary text-white transition-all duration-300 shrink-0 rounded-b-none ${isHideUIMode ? 'pb-[35px] pt-5 px-4' : 'pb-[35px] pt-5 px-4'}`}>
        <div className={`flex items-center justify-between transition-all duration-300 ${isHideUIMode ? 'mb-0' : 'mb-0'}`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-[50px] h-[50px] min-w-[50px] bg-white text-primary rounded-full border-2 border-white flex justify-center items-center text-[22px]">
              <Store size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">নিজাম ষ্টোর</h3>
              <p className="text-[11px] opacity-90 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">ডিজিটাল বাকীর খাতা</p>
            </div>
          </div>
          <div className="text-white text-[22px]">
            <Bell size={24} />
          </div>
        </div>
      </header>

      <div className={`relative -mt-5 bg-white rounded-t-[25px] pt-[25px] px-[15px] flex-1 flex flex-col overflow-hidden z-10 transition-all duration-300`}>
        
        <div className={`grid grid-cols-4 gap-y-[15px] gap-x-[5px] pb-[18px] mb-[18px] border-b border-[#f0f0f0] transition-all duration-300 ${isHideUIMode ? 'hidden' : 'flex'}`}>
          <FeatureItem icon={<UserPlus size={28} strokeWidth={1.5} />} text="নতুন<br>কাস্টমার" onClick={openAddScreen} />
          <FeatureItem icon={<Contact size={28} strokeWidth={1.5} />} text="কাস্টমার<br>লিস্ট" onClick={() => { setIsHideUIMode(true); document.getElementById('searchInput')?.focus(); }} />
          <FeatureItem icon={<FileText size={28} strokeWidth={1.5} />} text="লেনদেন<br>যোগ" onClick={() => appAction('লেনদেন যোগ')} />
          <FeatureItem icon={<Calendar size={28} strokeWidth={1.5} />} text="আজকের<br>হিসাব" onClick={() => appAction('আজকের হিসাব')} />
          <FeatureItem icon={<TrendingUp size={28} strokeWidth={1.5} />} text="বাকি<br>রিপোর্ট" onClick={() => appAction('বাকি রিপোর্ট')} />
          <FeatureItem icon={<Send size={28} strokeWidth={1.5} />} text="তাগাদা<br>SMS" onClick={() => appAction('তাগাদা SMS')} />
          <FeatureItem icon={<CloudUpload size={28} strokeWidth={1.5} />} text="ডেটা<br>সেভ/রিস্টোর" onClick={() => appAction('ব্যাকআপ')} />
          <FeatureItem icon={<Settings size={28} strokeWidth={1.5} />} text="সেটিংস" onClick={() => appAction('সেটিংস')} />
        </div>

        <div className={`flex justify-between gap-[15px] mb-5 px-[5px] shrink-0 relative transition-all duration-300 ${isHideUIMode ? 'hidden' : 'flex'}`}>
          <div className="absolute left-1/2 top-[10px] bottom-[10px] w-[1px] bg-[#ddd] -translate-x-1/2"></div>
          <div className="flex-1 min-w-0 text-center p-[10px] break-words">
            <div className="text-[22px] font-bold text-primary mb-1">৳ {formatAmountBng(totalDue)}</div>
            <div className="text-[11px] text-[#777] font-semibold">মোট পাবো</div>
          </div>
          <div className="flex-1 min-w-0 text-center p-[10px] break-words">
            <div className="text-[22px] font-bold text-danger mb-1">৳ {formatAmountBng(totalGive)}</div>
            <div className="text-[11px] text-[#777] font-semibold">মোট দিবো</div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-[10px] mb-2 shrink-0">
          <div className="flex-1 flex items-center min-w-0 relative">
            <input 
              id="searchInput"
              type="text" 
              placeholder="নাম বা নম্বর দিয়ে খুঁজুন..." 
              className="w-full py-[10px] px-[15px] border border-[#ddd] rounded-[10px] text-[13px] outline-none transition-colors duration-300 bg-[#f9f9f9] focus:border-primary focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsHideUIMode(true)}
            />
          </div>
          {!isHideUIMode && (
            <>
              <button className="bg-[#f0f0f0] w-[40px] h-[40px] rounded-[10px] flex justify-center items-center text-primary cursor-pointer transition-colors duration-300 shrink-0 border border-[#ddd] active:bg-[#e0e0e0]" onClick={() => setShowFilterModal(true)} title="ফিল্টার ও সর্ট">
                <Filter size={18} />
              </button>
              <button className="bg-[#f0f0f0] w-[40px] h-[40px] rounded-[10px] flex justify-center items-center text-primary cursor-pointer transition-colors duration-300 shrink-0 border border-[#ddd] active:bg-[#e0e0e0]" onClick={downloadPDF} title="পিডিএফ ডাউনলোড করুন">
                <Download size={18} />
              </button>
            </>
          )}
          {isHideUIMode && (
            <button className="text-[24px] text-[#555] cursor-pointer w-[40px] h-[40px] flex items-center justify-center shrink-0 transition-colors duration-200 active:text-danger" onClick={clearSearchMode}>
              <X size={24} />
            </button>
          )}
        </div>
        
        <div className="text-[11px] text-[#888] mb-[15px] pl-[2px] font-semibold shrink-0">
          দেখাচ্ছে: <span>{toBngDigits(customersList.length)}</span> জন
        </div>
        
        <div className="flex-1 overflow-y-auto -mx-[15px] px-[15px] pb-5 hide-scrollbar" ref={listRef} onScroll={handleScroll}>
          {customersList.map(c => (
            <div key={c.phone} className="flex justify-between items-center py-3 border-b border-[#eee] cursor-pointer transition-colors duration-200 active:bg-[#f0f0f0]" onClick={() => openTransactionScreen(c.phone)}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-[40px] h-[40px] min-w-[40px] bg-[#f0f0f0] text-primary rounded-full flex justify-center items-center font-bold text-[16px]">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] text-[#333] whitespace-nowrap overflow-hidden text-ellipsis">{c.name}</h4>
                  <p className="text-[11px] text-[#777] mt-0.5">{c.phone}</p>
                </div>
              </div>
              <div className="text-right ml-[10px] whitespace-nowrap">
                <div className={`text-[15px] font-bold ${c.type === 'supplier' ? 'text-danger' : 'text-primary'}`}>
                  ৳ {formatAmountBng(c.amount)}
                </div>
                <div className="text-[10px] text-[#777] mt-0.5">
                  {c.type === 'supplier' ? 'দিবো' : 'বাকি'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white flex justify-around py-[10px] border-t border-[#eee] items-center relative z-[100] shrink-0">
        <div className="flex flex-col items-center text-[12px] text-primary cursor-pointer gap-[3px]">
          <Home size={18} />
          Home
        </div>
        <div className="bg-primary w-[60px] h-[60px] min-w-[60px] rounded-full flex justify-center items-center text-white border-[5px] border-white -mt-[35px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-200 active:scale-95" onClick={openAddScreen}>
          <Plus size={24} />
        </div>
        <div className="flex flex-col items-center text-[12px] text-primary cursor-pointer gap-[3px]">
          <MoreVertical size={18} />
          More
        </div>
      </div>

      {showFilterModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[1000] flex flex-col justify-end" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-t-[20px] p-5 pb-[30px] w-full animate-[slideUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-[15px] pb-[10px] border-b border-[#eee]">
              <h3 className="text-[16px] text-[#333] font-bold">তালিকা ফিল্টার করুন</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer" onClick={() => { setFilterType('all'); setSortType('new'); setShowFilterModal(false); showToast('ফিল্টার ক্লিয়ার করা হয়েছে', 'info'); }}>
                  <X size={16} /> ক্লিয়ার
                </div>
                <span className="text-[24px] text-[#888] cursor-pointer leading-none px-1" onClick={() => setShowFilterModal(false)}>
                  <X size={20} />
                </span>
              </div>
            </div>
            
            <div className="font-bold text-sm text-gray-700 mb-2 mt-4">ধরণ অনুযায়ী:</div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="filter" value="all" checked={filterType === 'all'} onChange={() => setFilterType('all')} className="accent-primary scale-125" /> সব
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="filter" value="customer" checked={filterType === 'customer'} onChange={() => setFilterType('customer')} className="accent-primary scale-125" /> কাস্টমার (বাকি পাবো)
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="filter" value="supplier" checked={filterType === 'supplier'} onChange={() => setFilterType('supplier')} className="accent-primary scale-125" /> সাপ্লায়ার (বাকি দিবো)
              </label>
            </div>

            <div className="font-bold text-sm text-gray-700 mb-2 mt-4">বাকির পরিমাণ ও সময় অনুযায়ী:</div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="sort" value="new" checked={sortType === 'new'} onChange={() => setSortType('new')} className="accent-primary scale-125" /> নতুন লেনদেন আগে
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="sort" value="old" checked={sortType === 'old'} onChange={() => setSortType('old')} className="accent-primary scale-125" /> পুরাতন লেনদেন আগে
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="sort" value="low" checked={sortType === 'low'} onChange={() => setSortType('low')} className="accent-primary scale-125" /> কম বাকি আগে
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer font-semibold">
                <input type="radio" name="sort" value="high" checked={sortType === 'high'} onChange={() => setSortType('high')} className="accent-primary scale-125" /> বেশি বাকি আগে
              </label>
            </div>
          </div>
        </div>
      )}

      {createPortal(
        <div id="printArea" className="hidden">
          <div style={{ padding: '20px', fontFamily: "'SolaimanLipi', sans-serif", color: '#333', width: '100%' }}>
              <h2 style={{ textAlign: 'center', color: '#8c258d', marginBottom: '5px' }}>নিজাম ষ্টোর</h2>
              <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>ডিজিটাল বাকীর খাতা - সম্পূর্ণ তালিকা</h4>
              <p style={{ textAlign: 'center', fontSize: '12px', marginBottom: '20px', color: '#777' }}>
                তারিখ: {toBngDigits(new Date().getDate())}-{toBngDigits(new Date().getMonth() + 1)}-{toBngDigits(new Date().getFullYear())}
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>নাম</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>মোবাইল নম্বর</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>পরিমাণ</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>ধরণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersList.map(c => (
                      <tr key={c.phone}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.name}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.phone}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold', color: c.type === 'supplier' ? '#e11b22' : '#8c258d' }}>
                            {formatAmountBng(c.amount)}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                            {c.type === 'supplier' ? 'দিবো' : 'বাকি'}
                          </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
