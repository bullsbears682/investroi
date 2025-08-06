import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareIcon } from './icons/CustomIcons';
import LiveChat from './LiveChat';

const ChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        <MessageSquareIcon className="w-6 h-6" />
      </motion.button>

      {/* Live Chat Widget */}
      <LiveChat 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default ChatButton;