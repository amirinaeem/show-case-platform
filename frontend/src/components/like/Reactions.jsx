import { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, 
  faHeart, 
  faLaughBeam, 
  faSurprise, 
  faSadTear,
  faFire
} from '@fortawesome/free-solid-svg-icons';

const emojiOptions = [
  { icon: faThumbsUp, label: 'Like', value: '👍' },
  { icon: faHeart, label: 'Love', value: '❤️' },
  { icon: faLaughBeam, label: 'Haha', value: '😂' },
  { icon: faSurprise, label: 'Wow', value: '😮' },
  { icon: faSadTear, label: 'Sad', value: '😢' },
  { icon: faFire, label: 'Fire', value: '🔥' }
];

