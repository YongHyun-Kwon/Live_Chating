// @ts-nocheck

// IIFE
// 함수에 넣지 않으면 브라우저상에서 socket에 접근이 된다
// 하지만 즉시 실행 함수인 IIFE로 접근을 막을 수 있다.
;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')
  const chatsEl = document.getElementById('chats')
  /** @type {HTMLInputElement | null} */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init failed.')
  }

  /**
   * @type {Chat[]}
   */
  const chats = []

  const adjectives = ['멋진', '훌륭한', '화가난', '우울한', '새침한']
  const animals = ['토끼', '호랑이', '사자', '강아지', '고양이']

  /**
   * @param {string[]} array
   * @returns {string}
   */
  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length)
    const result = array[randomIdx]
    if (!result) {
      throw new Error('array length is 0.')
    }
    return result
  }

  const myNickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`

  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.send(
      JSON.stringify({
        nickname: myNickname,
        message: inputEl.value,
      })
    )
    inputEl.value = ''
  })

  const drawChats = () => {
    chatsEl.innerHTML = ''
    chats.forEach(({ message, nickname }) => {
      const div = document.createElement('div')
      div.innerText = `${nickname}: ${message}`
      chatsEl.appendChild(div)
    })
  }

  socket.addEventListener('message', (event) => {
    const { type, payload } = JSON.parse(event.data)

    if (type === 'sync') {
      const { chats: syncedChats } = payload
      chats.push(...syncedChats)
    } else if (type === 'chat') {
      const chat = payload
      chats.push(chat)
    }

    drawChats()
  })
})()
