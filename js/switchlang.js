let switchlang = document.querySelector('#switchlang')
let switchlangContent = document.querySelector('.switchlang-content')
switchlang && switchlang.addEventListener("click", openOrHideShareContent, false)

function openOrHideShareContent() {
  let isHidden = switchlangContent.classList.contains('hidden')
  if (isHidden) {
    switchlangContent.classList.remove('hidden')
  } else {
    switchlangContent.classList.add('hidden')
  }
}
