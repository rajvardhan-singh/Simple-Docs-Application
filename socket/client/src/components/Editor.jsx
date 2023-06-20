import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import styled from '@emotion/styled'
import { io } from 'socket.io-client'
import { log } from 'console'
import { useParams } from 'react-router-dom'

const Component = styled.div`
    background: #F5F5F5;
`

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

const Editor = () => {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    const { id } = useParams()

    const initialRender = useRef([1, 1]);

    //Init Quill
    useEffect(() => {

        const init = () => {
            const quillServer = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions } })
            quillServer.setText('Loading the document....')
            quillServer.disable();
            setQuill(quillServer)
            console.log('setting up quill server', quillServer);
            initialRender.current[0]++;
        }
        if (initialRender.current[0] === 1) init();
    }, [])

    //init socket server
    useEffect(() => {

        if (initialRender.current[1] === 1) {
            const socketServer = io(''); //server connect
            console.log('setting up socket server....');
            setSocket(socketServer)
            initialRender.current[1]++;
        }

        return () => {
            socket && socket.disconnect()  //server off on unmount
        }
    }, [])

    //deteching change in Quill Editor
    useEffect(() => {
        if (socket === null && quill === null) return

        const handleChange = (delta, oldData, source) => {
            // console.log(delta, oldData, source);
            // console.log("changing quill manually...");
            if (source !== 'user') return

            socket && socket.emit('send-changes', delta)
        }

        quill && quill.on('text-change', handleChange);

        return () => {
            quill && quill.off('text-chnage', handleChange)
        }
    }, [quill, socket])

    //broadcast from server and uodate quill content 
    useEffect(() => {
        if (socket === null && quill === null) return

        const handleChange = (delta) => {
            // console.log(delta);
            // console.log('changing quill broadcast...');
            // if (source !== 'user') return
            quill.updateContents(delta);
            // socket && socket.emit('send-changes', delta)
        }

        socket && socket.on('receive-change', handleChange);

        return () => {
            socket && socket.off('receive-chnage', handleChange)
        }
    }, [quill, socket])

    //load document data of perticulsr Document Id
    useEffect(() => {
        if (quill === null || socket === null) return

        socket && socket.once('load-document', document => {
            console.log("loaading document...");
            quill && quill.setContents(document);
            quill && quill.enable();
        })

        //fetch document
        socket && socket.emit('get-document', id);
    }, [socket, quill, id])

    useEffect(() => {

        if (quill === null || socket === null) return;

        const interval = setInterval(() => {
            socket && socket.emit('save-document', quill.getContents())
        }, 2000)

        //remove setInterval
        return (() => {
            clearInterval(interval);
        })
        
    }, [socket, quill])

    return (
        <Component>
            <Box className='container' id='container' />
        </Component>
    )
}

export default Editor