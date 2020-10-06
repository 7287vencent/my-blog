import React, { useState, useEffect } from 'react';
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'

const { Option } = Select;
const { TextArea } = Input

function AddArticle (props) {
  const renderer = new marked.Renderer();
  const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState('')   //文章标题
  const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useState()   //发布日期
  const [updateDate, setUpdateDate] = useState() //修改日志的日期
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectType] = useState('请选择类型') //选择的文章类别
  const [selectedTypeId, setSelectedTypeId] = useState(0) // 选择的文章类型id
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });
  // 个人 使用 操作，处理图片用的函数 因为图片未上传到服务器
  const changeImgUrl = (value) => {
    let arr = value.split('[img]')
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === '(') {
        // 查找picture 的位置
        let index = arr[i].indexOf('picture') // 笔记文件夹 + 13 picture + 7
        if (index !== -1) {
          arr[i] = arr[i][0] + '/static/picture' + arr[i].slice(index + 7)
        }
      }
    }
    return arr.join('[img]')
  }
  const changeContent = (e) => {
    let value = changeImgUrl(e.target.value)
    // console.log("文章=>>>", value)
    setArticleContent(value)
    let html = marked(e.target.value)
    // console.log("heml", html)
    setMarkdownContent(html)
  }

  const changeIntroduce = (e) => {
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }
  //从中台得到文章类别信息
  const getTypeInfo = () => {

    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      header: { 'Access-Control-Allow-Origin': '*' },
      withCredentials: true,
    }).then(
      res => {
        if (res.data.data == "没有登录") {
          localStorage.removeItem('openId')
          props.history.push('/')
        } else {
          setTypeInfo(res.data.data)
        }

      }
    )
  }
  const getArticleById = (id) => {
    // console.log("修改文章的id", id)
    axios(servicePath.getArticleById + id, {
      withCredentials: true,
      header: { 'Access-Control-Allow-Origin': '*' }
    }).then(
      res => {
        //let articleInfo= res.data.data[0]
        setArticleTitle(res.data.data[0].title)
        setArticleContent(res.data.data[0].article_content)
        let html = marked(res.data.data[0].article_content)
        setMarkdownContent(html)
        setIntroducemd(res.data.data[0].introduce)
        let tmpInt = marked(res.data.data[0].introduce)
        setIntroducehtml(tmpInt)
        setShowDate(res.data.data[0].addTime)
        setSelectType(res.data.data[0].typeName)
        setSelectedTypeId(res.data.data[0].typeId)
        // console.log("res=>>>", res.data.data[0].typeName, selectedType)
      }
    )
  }


  //选择类别后的便哈
  const selectTypeHandler = (value) => {
    // console.log('value', value, typeInfo)
    setSelectedTypeId(value)
  }
  // 
  const saveArticle = () => {
    if (!selectedTypeId) {
      message.error('必须选择文章类别')
      return false
    } else if (!articleTitle) {
      message.error('文章名称不能为空')
      return false
    } else if (!articleContent) {
      message.error('文章内容不能为空')
      return false
    } else if (!introducemd) {
      message.error('简介不能为空')
      return false
    } else if (!showDate) {
      message.error('发布日期不能为空')
      return false
    }
    // setArticleContent('0000')
    // console.log("articleContent", articleContent)
    message.success('检验通过')
    let dataProps = {}   //传递到接口的参数
    dataProps.type_id = selectedTypeId
    dataProps.title = articleTitle
    dataProps.article_content = articleContent
    dataProps.introduce = introducemd
    let datetext = showDate.replace('-', '/') //把字符串转换成时间戳
    dataProps.addTime = (new Date(datetext).getTime()) / 1000


    if (articleId == 0) {
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000
      console.log('articleId=:' + articleId, dataProps)
      axios({
        method: 'post',
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true
      }).then(
        res => {
          console.log('article-----=:' + res.data)
          setArticleId(res.data.insertId)
          if (res.data.isScuccess) {
            message.success('文章保存成功')
          } else {
            message.error('文章保存失败');
          }

        }
      )
    } else {

      dataProps.id = articleId
      console.log("data,===", dataProps)
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        header: { 'Access-Control-Allow-Origin': '*' },
        data: dataProps,
        withCredentials: true
      }).then(
        res => {

          if (res.data.isScuccess) {
            message.success('文章保存成功')
          } else {
            message.error('保存失败');
          }


        }
      )
    }
  }

  useEffect(() => {
    getTypeInfo()
    //获得文章ID
    let tmpId = props.match.params.id
    if (tmpId) {
      setArticleId(tmpId)
      getArticleById(tmpId)
    }
  }, [])
  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10} >
            <Col span={20}>
              <Input
                value={articleTitle}
                placeholder="博客标题"
                onChange={e => {

                  setArticleTitle(e.target.value)
                }}
                size="large" />
            </Col>
            <Col span={4}>
              &nbsp;
              {/* 选择文章类别 */}
              <Select defaultValue={selectedType} size="large" onChange={selectTypeHandler}>
                {
                  typeInfo.map((item, index) => {
                    return (<Option key={item.Id} value={item.Id}>{item.typeName}</Option>)
                  })
                }
              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10} >
            <Col span={12}>
              <TextArea
                value={articleContent}
                className="markdown-content"
                rows={35}
                onChange={changeContent}
                onPressEnter={changeContent}
                placeholder="文章内容"
              />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }} >

              </div>

            </Col>
          </Row>

        </Col>

        <Col span={6}>
          <Row>
            <Col span={24}>
              <Button size="large">暂存文章</Button>&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}> 发布文章</Button>
              <br />
            </Col>
            <Col span={24}>
              <br />
              <TextArea
                rows={4}
                value={introducemd}
                onChange={changeIntroduce}
                onPressEnter={changeIntroduce}
                placeholder="文章简介"
              />
              <br /><br />
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: '文章简介：' + introducehtml }} >
              </div>

            </Col>
            <Col span={12}>
              <div className="date-select">
                <DatePicker
                  onChange={(date, dateString) => setShowDate(dateString)}
                  placeholder="发布日期"
                  size="large"
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="date-select">
                <DatePicker
                  placeholder="修改日期"
                  size="large"
                />
              </div>
            </Col>
          </Row>

        </Col>
      </Row>
    </div>

  )
}
export default AddArticle