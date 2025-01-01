import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const redirectToLogin = () => {
     navigate('/') 
  }
  const redirectToArticles = () => {
     navigate('/articles') 
  }

  const logout = () => {
    localStorage.removeItem('token')
    redirectToLogin()
    setMessage("Goodbye!")
  }

  const login = async ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const response = await axios.post(loginUrl, { username, password })
      localStorage.setItem('token', response.data.token)
      setMessage(response.data.message)
      redirectToArticles()
    } catch (error) {
        setMessage('Login failed. Please check your credentials.')
    } finally {
        setSpinnerOn(false)
    }
  }

  const getArticles = async () => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: token
        }
      })
      setArticles(response.data.articles)
      setMessage(response.data.message)
    } catch (error) {
        if (error.response.status === 401) {
        redirectToLogin()
        } else {
        setMessage('Failed to fetch articles.')
        }
    } finally {
        setSpinnerOn(false)
    }
  }

  const postArticle = async (article) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const response = await axios.post(articlesUrl, article, {
        headers: {
          Authorization: token
        }
      })
      setMessage(response.data.message)
      setArticles((prevArticles) => [...prevArticles, response.data.article])
    } catch (error) {
        setMessage('Failed to create article. Please try again.')
    } finally {
        setSpinnerOn(false)
    }
  }

  const updateArticle = async ({ article_id, article }) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const response = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: {
          Authorization: token
        }
      })
      setMessage(response.data.message)
      setArticles((prevArticles) =>
        prevArticles.map((a) => (a.article_id === article_id ? response.data.article : a))
      )
      setCurrentArticleId(null)
    } catch (error) {
        setMessage('Failed to update article. Please try again.')
    } finally {
        setSpinnerOn(false)
    }
  }

  const deleteArticle = async (article_id) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: {
          Authorization: token
        }
      })
      setMessage(response.data.message)
      setArticles((prevArticles) => prevArticles.filter((a) => a.article_id !== article_id))
    } catch (error) {
        setMessage('Failed to delete article. Please try again.')
    } finally {
        setSpinnerOn(false)
    }
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle} 
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(a => a.article_id === currentArticleId)} 
              />
              <Articles 
                articles={articles} 
                deleteArticle={deleteArticle} 
                getArticles={getArticles}
                setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
