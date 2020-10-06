import { Avatar, Divider } from 'antd'
import '../static/style/components/author.css'
import { useState, useEffect } from 'react'
const Author = () => {
  // console.log("this", this)
  
  return (
    <div className="author-div comm-box">
      <div className="avatar-img">
        {/* <Avatar size={100} src="../static/images/216d5be710ea81064d5ec2ab36b94aa0.jpeg" /> */}
        <div>
          <div className="play-en">
            <div className="btn"></div>
            <div className="play">
              <audio id="audio" ></audio>
            </div>
          </div>
        </div>
      </div>
      <div className="author-introduction">
        明天的你会感谢今天努力的你，一步一步提高，想想你自己😊
                {/* <Divider>社交账号</Divider>
        <Avatar size={28} icon="github" className="account" />
        <Avatar size={28} icon="qq" className="account" />
        <Avatar size={28} icon="wechat" className="account" /> */}

      </div>
    </div>
  )

}

export default Author