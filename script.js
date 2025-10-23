
function setCookie(name, value, days=30) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
}
function getCookie(name) {
  let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? decodeURIComponent(v[2]) : null;
}
function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}


let likeCount = 100;
let dislikeCount = 20;
let comments = [];
let userVoted = null; 
let userCommented = false;


const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCountSpan = document.getElementById('likeCount');
const dislikeCountSpan = document.getElementById('dislikeCount');
const commentInput = document.getElementById('commentInput');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const commentsList = document.getElementById('commentsList');
const msg = document.getElementById('msg');
const resetBtn = document.getElementById('resetBtn');


function render() {
  likeCountSpan.textContent = likeCount;
  dislikeCountSpan.textContent = dislikeCount;
  likeBtn.classList.toggle('selected', userVoted === 'like');
  dislikeBtn.classList.toggle('selected', userVoted === 'dislike');
  renderComments();
  commentInput.value = '';
  submitBtn.disabled = !!userCommented;
  commentInput.disabled = !!userCommented;
  clearBtn.disabled = !!userCommented;
  if(userCommented) {
    showMsg('You have already submitted a comment.');
  } else {
    showMsg('');
  }
}
function renderComments() {
  commentsList.innerHTML = '';
  comments.forEach(comment => {
    const li = document.createElement('li');
    li.textContent = comment;
    commentsList.appendChild(li);
  });
}
function showMsg(text) {
  msg.textContent = text;
}


likeBtn.onclick = () => {
  if(userVoted) return;
  likeCount++;
  userVoted = 'like';
  setCookie('lab6_vote', 'like');
  setCookie('lab6_likeCount', likeCount);
  setCookie('lab6_dislikeCount', dislikeCount);
  render();
};
dislikeBtn.onclick = () => {
  if(userVoted) return;
  dislikeCount++;
  userVoted = 'dislike';
  setCookie('lab6_vote', 'dislike');
  setCookie('lab6_likeCount', likeCount);
  setCookie('lab6_dislikeCount', dislikeCount);
  render();
};
submitBtn.onclick = () => {
  const comment = commentInput.value.trim();
  if(!comment) {
    showMsg('Please enter a comment.');
    return;
  }
  if(userCommented) return;
  comments.push(comment);
  userCommented = true;
  setCookie('lab6_comments', JSON.stringify(comments));
  setCookie('lab6_commented', 'true');
  render();
};
clearBtn.onclick = () => {
  commentInput.value = '';
};
resetBtn.onclick = () => {
  if(confirm('Reset all votes and comments?')) {
    
    ['lab6_vote','lab6_likeCount','lab6_dislikeCount','lab6_comments','lab6_commented'].forEach(deleteCookie);
    
    likeCount = 100;
    dislikeCount = 20;
    comments = [];
    userVoted = null;
    userCommented = false;
    render();
    showMsg('All data reset! You can vote and comment again.');
  }
};


function loadFromCookies() {
 
  const vote = getCookie('lab6_vote');
  if(vote === 'like' || vote === 'dislike') userVoted = vote;

  const lc = parseInt(getCookie('lab6_likeCount'));
  if(!isNaN(lc)) likeCount = lc;
  const dc = parseInt(getCookie('lab6_dislikeCount'));
  if(!isNaN(dc)) dislikeCount = dc;
 
  const cmt = getCookie('lab6_comments');
  if(cmt) {
    try { comments = JSON.parse(cmt) || []; }
    catch { comments = []; }
  }
 
  userCommented = getCookie('lab6_commented') === 'true';
}

loadFromCookies();
render();