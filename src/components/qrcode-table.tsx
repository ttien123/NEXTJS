'use client';
import { getTableLink } from '@/lib/utils';
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react';
const QRCodeTable = ({token, tableNumber, width = 250}:{ token: string, tableNumber: number, width?: number}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current!;
        QRCode.toCanvas(canvas, getTableLink({token, tableNumber}), function (error) {
            if (error) console.error(error)
            console.log('success!');
          })
    })
    return (
        <canvas ref={canvasRef} />
    );
}

export default QRCodeTable;
