/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './AvatarUploader.css';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function AvatarUploader(props) {
  let navigate = useNavigate();
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  const fileDialog = useRef(null);
  const [avatarURL, setAvatarURL] = useState('');

  useEffect(() => {
    if (props.userId) {
      async function getAvatarURL() {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/avatar`, {headers: authHeader});
        const data = res.data;
        setAvatarURL(`${data.url}`);
      }
      getAvatarURL();
    }
  }, [props.userId]);

  function onOverlayClick() {
    fileDialog.current.click();
  };

  async function onFileChange(evt) {
    const uploadFile = evt.target.files[0];
    if (uploadFile.type.startsWith('image/')) {
      const uploadForm = new FormData();
      uploadForm.append('userId', props.userId);
      uploadForm.append('avatar', uploadFile);
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/update/avatar`,
            uploadForm,
            {headers: authHeader});
        if (res.data.success) {
          navigate(0);
        } else {
          console.log(res.data.error);
        }
      } catch (err) {
        console.log('Error updating avatar');
        console.log(err);
      }
    }
  }

  return (
    <div id="avatar-uploader">
      <input id="file-dialog" type='file' ref={fileDialog} accept="image/*" onChange={onFileChange}/>
      <img id="current-pic" src={avatarURL} alt="avatar" onError={(evt) => {
        evt.target.src = 'https://via.placeholder.com/320?text=Set Your Profile Picture';
      }} />
      <div id="upload-overlay" onClick={onOverlayClick}>
        <Typography variant='h6'>
          Change Profile Picture
        </Typography>
      </div>
    </div>
  );
}

export default AvatarUploader;
