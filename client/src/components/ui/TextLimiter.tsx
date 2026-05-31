import React, { useState, useRef, useEffect } from 'react';

const TextLimiter = ({ 
  text, 
  maxLength = 200, 
  className = "",
  showToggle = true,
  expanded: controlledExpanded,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);

  // Use controlled expanded state if provided, otherwise use internal state
  const expanded = controlledExpanded !== undefined ? controlledExpanded : isExpanded;

  useEffect(() => {
    if (text && text.length > maxLength) {
      setNeedsTruncation(true);
    } else {
      setNeedsTruncation(false);
    }
  }, [text, maxLength]);

  const handleToggle = () => {
    const newExpandedState = !expanded;
    
    if (controlledExpanded !== undefined && onToggle) {
      // If controlled component, use callback
      onToggle(newExpandedState);
    } else {
      // If uncontrolled component, use internal state
      setIsExpanded(newExpandedState);
    }
  };

  if (!text) return null;

  const displayText = expanded || !needsTruncation || !showToggle 
    ? text 
    : `${text.substring(0, maxLength)}...`;

  return (
    <div className={`text-limiter ${className}`}>
      <div ref={textRef} className="text-content">
        {displayText}
      </div>
      
      {needsTruncation && showToggle && (
        <button
          onClick={handleToggle}
          className="text-limiter-toggle"
          aria-expanded={expanded}
        >
          {expanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

// Optional: Add a hook version for non-component usage
export const useTextLimiter = (text, maxLength = 200) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [needsTruncation, setNeedsTruncation] = useState(false);

  useEffect(() => {
    if (text && text.length > maxLength) {
      setNeedsTruncation(true);
      setDisplayText(isExpanded ? text : `${text.substring(0, maxLength)}...`);
    } else {
      setNeedsTruncation(false);
      setDisplayText(text || '');
    }
  }, [text, maxLength, isExpanded]);

  const toggle = () => setIsExpanded(!isExpanded);

  return {
    displayText,
    isExpanded,
    needsTruncation,
    toggle,
    // Helper methods
    expand: () => setIsExpanded(true),
    collapse: () => setIsExpanded(false),
  };
};

export default TextLimiter;