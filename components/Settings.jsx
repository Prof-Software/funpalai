import React from 'react';

const Settings = ({ font, setFont }) => {
  const handleFontChange = (selectedFont) => {
    setFont(selectedFont);
    localStorage.setItem('selectedFont', selectedFont);
  };

  return (
    <div className='min-h-screen w-full bg-[#000000] flex flex-col items-center p-10 overflow-y-auto'>
      <h1 className='text-4xl mb-8 font-semibold text-gray-100  bg-black z-10 w-full text-center pt-4'>
        Settings
      </h1>
      
      <div className='w-full max-w-md space-y-6 pb-8'>
        {/* Font Selection */}
        <div className='space-y-4'>
          <label className='text-2xl text-gray-200'>Font Selection</label>
          <div className='flex flex-col space-y-3'>
            <button
              onClick={() => handleFontChange('MyFont')}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                font === 'MyFont'
                  ? 'bg-[#280707] shadow-pink-400 shadow-sm text-gray-100'
                  : 'bg-black shadow-pink-400 shadow-sm text-gray-100'
              }`}
            >
              Font 1 (Kaftan)
            </button>
            <button
              onClick={() => handleFontChange('Gambarino')}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                font === 'Gambarino'
                  ? 'bg-[#280707] shadow-pink-400 shadow-sm text-gray-100'
                  : 'bg-black shadow-pink-400 shadow-sm text-gray-100'
              }`}
            >
              Font 2 (Gambarino)
            </button>
          </div>
        </div>

        {/* Theme Configuration */}
        <div className='space-y-4'>
          <label className='text-2xl text-gray-200'>Theme Configuration</label>
          <div className='flex flex-col space-y-3'>
            <button
              onClick={() => alert('Dark Theme Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Dark Theme
            </button>
            <button
              onClick={() => alert('Light Theme Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Light Theme
            </button>
          </div>
        </div>

        {/* Chatbot Behavior */}
        <div className='space-y-4'>
          <label className='text-2xl text-gray-200'>Chatbot Behavior</label>
          <div className='flex flex-col space-y-3'>
            <button
              onClick={() => alert('Response Speed: Fast Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Response Speed: Fast
            </button>
            <button
              onClick={() => alert('Response Speed: Slow Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Response Speed: Slow
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className='space-y-4'>
          <label className='text-2xl text-gray-200'>Notification Preferences</label>
          <div className='flex flex-col space-y-3'>
            <button
              onClick={() => alert('Notifications: On Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Notifications: On
            </button>
            <button
              onClick={() => alert('Notifications: Off Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Notifications: Off
            </button>
          </div>
        </div>

        {/* Additional Section */}
        <div className='space-y-4'>
          <label className='text-2xl text-gray-200'>Additional Settings</label>
          <div className='flex flex-col space-y-3'>
            <button
              onClick={() => alert('Setting 1 Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Setting 1
            </button>
            <button
              onClick={() => alert('Setting 2 Applied')}
              className='w-full p-4 bg-black shadow-pink-400 shadow-sm text-gray-100 text-left rounded-lg transition-all duration-200 hover:bg-[#280707]'
            >
              Setting 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
