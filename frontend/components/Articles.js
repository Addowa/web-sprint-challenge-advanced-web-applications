import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles({ articles, getArticles, deleteArticle, setCurrentArticleId, currentArticleId }) {
  const token = localStorage.getItem('token')
  console
  if (!token) {
    return <Navigate to="/" />
  }

  useEffect(() => {
    getArticles()
  }, [])

  return (
    <div className="articles">
      <h2>Articles</h2>
      {
        articles.length === 0
          ? 'No articles yet'
          : articles.map(a => {
            return (
              <div className="article" key={a.article_id}>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <p>Topic: {a.topic}</p>
                </div>
                <div>
                  <button onClick={() => setCurrentArticleId(a.article_id)}>Edit</button>
                  <button onClick={() => deleteArticle(a.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
