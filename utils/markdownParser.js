// utils/markdownParser.js
import React from 'react';
import ReactMarkdown from 'react-markdown';

export const parseMarkdown = (text) => {
  return <ReactMarkdown>{text}</ReactMarkdown>;
};