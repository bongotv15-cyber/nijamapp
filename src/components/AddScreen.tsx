import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { ArrowLeft, Users } from 'lucide-react';

export default function AddScreen() {
  const { appData, updateAppData, setCurrentScreen, activePhone, isEditMode, showToast } = useAppContext();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'customer' | 'supplier'>('customer');

  useEffect(() => {
    if (isEditMode && activePhone && appData.customers[activePhone]) {
      const c = appData.customers[activePhone];
      setName(c.name);
      setPhone(c.phone);
      setAddress(c.address);
      setType(c.type);
    } else {
      setName('');
      setPhone('');
      setAddress('');
      setType('customer');
    }
  }, [isEditMode, activePhone, appData.customers]);

  const saveCustomer = () => {
    const tName = name.trim();
    const tPhone = phone.trim();
    const tAddress = address.trim();

    if (tName === '' || tPhone === '') {
      return showToast('দয়া করে নাম এবং মোবাইল নম্বর দিন!', 'error');
    }

    let oldAmount = 0;
    let oldTime = Date.now();
    const newAppData = { ...appData };

    if (isEditMode && activePhone) {
      if (newAppData.customers[activePhone]) {
        oldAmount = newAppData.customers[activePhone].amount;
        oldTime = newAppData.customers[activePhone].time;
      }
      if (activePhone !== tPhone) {
        newAppData.transactions[tPhone] = newAppData.transactions[activePhone] || [];
        delete newAppData.customers[activePhone];
        delete newAppData.transactions[activePhone];
      }
      showToast('তথ্য পরিবর্তন করা হয়েছে!', 'success');
    } else {
      if (newAppData.customers[tPhone]) {
        return showToast('এই নম্বরে ইতিমধ্যে কাস্টমার আছে!', 'error');
      }
      showToast('যোগ করা হয়েছে!', 'success');
    }

    newAppData.customers[tPhone] = { name: tName, phone: tPhone, address: tAddress, type, amount: oldAmount, time: oldTime };
    if (!newAppData.transactions[tPhone]) {
      newAppData.transactions[tPhone] = [];
    }

    updateAppData(newAppData);
    setCurrentScreen('home');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f9f9f9]">
      <div className="flex items-center py-5 px-[15px] text-[20px] font-semibold bg-primary text-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] shrink-0">
        <span className="text-[24px] mr-[15px] cursor-pointer flex items-center" onClick={() => setCurrentScreen('home')}>
          <ArrowLeft size={24} />
        </span>
        <span className="ml-[10px]">নিজাম ষ্টোর</span>
      </div>
      
      <div className="bg-white my-5 mx-[15px] py-[25px] px-5 rounded-[16px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        <div className="text-[50px] mb-[10px] text-primary flex justify-center">
          <Users size={50} strokeWidth={1.5} />
        </div>
        <div className="text-[20px] font-bold text-[#333]">{isEditMode ? 'তথ্য পরিবর্তন করুন' : 'নতুন যোগ করুন'}</div>
        <div className="text-[14px] text-[#666] mb-5">তথ্য যোগ করুন</div>
        
        <div className="flex justify-center gap-5 mb-5">
          <label className="flex items-center gap-[6px] text-[14px] text-[#333] cursor-pointer font-semibold">
            <input type="radio" name="personType" value="customer" checked={type === 'customer'} onChange={() => setType('customer')} className="accent-primary scale-125" /> কাস্টমার
          </label>
          <label className="flex items-center gap-[6px] text-[14px] text-[#333] cursor-pointer font-semibold">
            <input type="radio" name="personType" value="supplier" checked={type === 'supplier'} onChange={() => setType('supplier')} className="accent-primary scale-125" /> সাপ্লায়ার
          </label>
        </div>
        
        <input type="text" placeholder="নাম লিখুন" className="w-full p-[14px] mb-[15px] rounded-[10px] border border-[#ddd] text-[15px] outline-none transition-colors duration-300 focus:border-primary" value={name} onChange={e => setName(e.target.value)} />
        
        <div className="flex border border-[#ddd] rounded-[10px] overflow-hidden mb-[15px] transition-colors duration-300 focus-within:border-primary">
          <div className="bg-[#f5f5f5] p-[14px] font-semibold border-r border-[#ddd] flex items-center text-[#555] whitespace-nowrap">+880</div>
          <input type="number" placeholder="মোবাইল নম্বর" className="border-none m-0 rounded-none flex-1 w-auto min-w-0 p-[14px] text-[15px] outline-none" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        
        <input type="text" placeholder="ঠিকানা লিখুন (ঐচ্ছিক)" className="w-full p-[14px] mb-[15px] rounded-[10px] border border-[#ddd] text-[15px] outline-none transition-colors duration-300 focus:border-primary" value={address} onChange={e => setAddress(e.target.value)} />
        
        <button className="w-full p-[15px] mt-[10px] border-none rounded-[10px] bg-primary text-white text-[17px] font-semibold cursor-pointer transition-colors duration-300 active:bg-primary-dark" onClick={saveCustomer}>
          {isEditMode ? 'পরিবর্তন সংরক্ষণ করুন' : 'সংরক্ষণ করুন'}
        </button>
      </div>
    </div>
  );
}
