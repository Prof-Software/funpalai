import React from 'react';

const Settings = ({ font, setFont }) => {
  const handleFontChange = (selectedFont) => {
    setFont(selectedFont);
    localStorage.setItem('selectedFont', selectedFont);
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] flex flex-col items-center p-10 overflow-y-auto text-gray-100">
      <h1 className="text-4xl mb-8 font-semibold text-gray-100 w-full text-center pt-4">
        Settings
      </h1>

      <div className="w-full max-w-3xl space-y-10 pb-8">
        {/* Font Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Font Selection</h2>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleFontChange('MyFont')}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                font === 'MyFont'
                  ? 'bg-[#280707] shadow-pink-400 shadow-sm'
                  : 'bg-[#1e1e1e] hover:bg-[#333333]'
              }`}
            >
              Font 1 (Kaftan)
            </button>
            <button
              onClick={() => handleFontChange('Gambarino')}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                font === 'Gambarino'
                  ? 'bg-[#280707] shadow-pink-400 shadow-sm'
                  : 'bg-[#1e1e1e] hover:bg-[#333333]'
              }`}
            >
              Font 2 (Gambarino)
            </button>
          </div>
        </div>

        {/* Chat & Conversation Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Chat & Conversation Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Message Save Options</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>Auto-delete (Free)</option>
                <option>Store Messages (Premium)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Image Generation Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Image Generation Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Style</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>Photorealistic</option>
                <option>Watercolor</option>
                <option>Oil Painting</option>
                <option>3D Render</option>
                <option>Abstract Art</option>
              </select>
            </label>

            <label className="flex items-center justify-between">
              <span>Resolution</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>720p</option>
                <option>1080p</option>
                <option>4K</option>
              </select>
            </label>

            <label className="flex items-center justify-between">
              <span>Aspect Ratio</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>Square (1:1)</option>
                <option>Portrait (4:5)</option>
                <option>Landscape (16:9)</option>
              </select>
            </label>

            <label className="flex items-center justify-between">
              <span>Advanced Editing</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="outpainting"
                    disabled
                    className="appearance-none h-4 w-4 rounded border border-gray-400 cursor-not-allowed"
                  />
                  <label htmlFor="outpainting" className="text-gray-400">
                    Outpainting
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="styleTransfer"
                    disabled
                    className="appearance-none h-4 w-4 rounded border border-gray-400 cursor-not-allowed"
                  />
                  <label htmlFor="styleTransfer" className="text-gray-400">
                    Style Transfer
                  </label>
                </div>
              </div>
            </label>
            <p className="text-sm text-gray-400 italic">
              Upgrade to Premium to unlock these features.
            </p>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Voice Settings (Future Feature)</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>AI Voice Selection</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>Default Voice</option>
                <option>Voice A</option>
                <option>Voice B</option>
              </select>
            </label>

            <label className="flex items-center justify-between">
              <span>Speech Speed & Tone</span>
              <input
                type="range"
                disabled
                min={0.5}
                max={2}
                step={0.1}
                defaultValue={1}
                className="w-full bg-[#333333] cursor-not-allowed"
              />
            </label>
            <p className="text-sm text-gray-400 italic">
              Coming soon. Upgrade options will be available when this feature is released.
            </p>
          </div>
        </div>

        {/* Simulator Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Simulator Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Scenario Mode</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>Practice Mode</option>
                <option>Role Model Mode</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="mb-2">Behavior Customization</span>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <label className="text-sm">Empathy</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={50}
                    disabled
                    className="bg-[#333333] cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm">Humor</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={25}
                    disabled
                    className="bg-[#333333] cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm">Formality</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={75}
                    disabled
                    className="bg-[#333333] cursor-not-allowed"
                  />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between">
              <span>Complexity Level</span>
              <select
                disabled
                className="bg-[#1e1e1e] p-2 rounded-md text-gray-400 cursor-not-allowed"
              >
                <option>Basic</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <p className="text-sm text-gray-400 italic">
              Unlock Premium to access Simulator Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
