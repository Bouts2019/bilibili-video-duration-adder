// ==UserScript==
// @name         视频单P总时长
// @namespace    https://www.bilibili.com/video
// @version      1.2
// @description  多分P视频的每一P，在单P时长后面加上当P及当P之前所有视频的总时长
// @author       bird blue
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license MIT
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 创建一个观察器实例并定义回调函数
    let times = 0
    let functionUpdating = false
    let refreshTime = () => {
        // 在这里检查DOM变化并执行脚本
        console.log(`%c video single duration: updated ${++times} times`, 'background: #222; color: #bada55')
        if (functionUpdating) {
            return
        }
        functionUpdating = true
        let videos = document.querySelectorAll('#multi_page>.cur-list>ul.list-box>li')
        let cumulativeDuration = 0
        for (let v of videos) {
            const singleDurationEl = v.querySelector('.duration')
            const timeParts = singleDurationEl.innerText.split(':').map(Number);
            const hours = timeParts.length >= 3 ? timeParts[timeParts.length - 3] : 0;
            const minutes = timeParts.length >= 2 ? timeParts[timeParts.length - 2] : 0;
            const seconds = timeParts.length >= 1 ? timeParts[timeParts.length - 1] : 0;
 
            cumulativeDuration += hours * 3600 + minutes * 60 + seconds;
 
            const cumulativeHours = Math.floor(cumulativeDuration / 3600);
            const cumulativeMinutes = Math.floor((cumulativeDuration % 3600) / 60);
            const cumulativeSeconds = cumulativeDuration % 60;
 
            const formattedAllDuration = `${String(cumulativeHours).padStart(2, '0')}:${String(cumulativeMinutes).padStart(2, '0')}:${String(cumulativeSeconds).padStart(2, '0')}`;
 
            singleDurationEl.innerText += ` | ${formattedAllDuration}`
        }
    }
    const observer = new MutationObserver(() => refreshTime());
 
    observer.observe(document.querySelector('#multi_page'), { childList: true, subtree: true });
    document.querySelector('#multi_page > div.head-con > div.head-left > div').addEventListener('click', () => {
        if (document.querySelector('#multi_page')) {
            functionUpdating = false
            refreshTime();
        }
    })
 
})();
