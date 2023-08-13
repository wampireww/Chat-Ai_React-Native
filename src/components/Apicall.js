import React, { useState } from 'react'
import axios from 'axios';

const shortid = require('shortid');

export const Apicall=async(message,setsohbet,settextkontrol,chatHistory,Apikey,Model,Contenttype)=> {
  
 var deger="";

        settextkontrol(true);

        const messages = [
          { role: 'system', content: 'You are' },
          ...chatHistory, // Önceki sohbet geçmişini ekleyin
          { role: 'user', content: message }
        ];
      
        const zaman=new Date()
      
          try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
              model:Model,
              messages: messages
            }, {
              headers: {
                'Content-Type': Contenttype,
                'Authorization': "Bearer"+" "+Apikey 
              }
            }
            );
      
              setsohbet(old=>[...old,{platform:"ChatGPT",mesaj:response.data.choices[0].message.content,tarih:zaman.getTime()+zaman.getSeconds(1),gonderen:"ai",id:shortid.generate(),durum:"array"}]);
              settextkontrol(false)
       
          
          //  return setgelenmesaj(response.data.choices[0].message.content);
          } catch (error) {

            if (error.response) {
              // Axios hatası olduğunda HTTP hata kodunu ayıkla
              const statusCode = error.response.status;
              
              if (statusCode === 429) {
                deger="Error: Too many requests have been made. Please try again later.";

              } else if (statusCode === 400) {
                deger="Error: Request is invalid or malformed. Please check your ChatGPT API credentials in the Settings section.";
              
              } else if (statusCode === 401) {
                deger="Error: Authentication failed. Please check your ChatGPT API credentials in the Settings section.";
              } else {
                deger="Error: An unknown error occurred. Please check your ChatGPT API credentials in the Settings section.",+" "+statusCode;
              }
            } else {
              deger="Error: An unknown error occurred."+" "+error.message;
            }
            
            console.error('ChatGPT API error:', error);
            // Hata durumunda boş bir yanıt döndür
            settextkontrol(false);
            return console.error('ChatGPT API error:', error), setsohbet(old=>[...old,{platform:"ChatGPT",mesaj:deger,tarih:zaman.getTime()+zaman.getSeconds(1),id:shortid.generate(),gonderen:"ai",durum:"array"}]);
            
          }
        };

