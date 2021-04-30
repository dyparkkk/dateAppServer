document.querySelectorAll('#user-list tr').forEach((el) => {
  el.addEventListener('click', function () {
    const id = el.querySelector('td').textContent;
    login(id);
  });
});

async function getUser() {
    try {
      const res = await axios.get('/users');
      const users = res.data;
      console.log(users);
      const tbody = document.querySelector('#user-list tbody');
      tbody.innerHTML = '';
      users.map(function (user) {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
          getComment(user._id);
        });
        // 로우 셀 추가
        let td = document.createElement('td');
        td.textContent = user._id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.age;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.phone;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.mbti;
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 사용자 등록 시
document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.age.value;
  const phone = e.target.phone.value;
  const mbti = e.target.mbti.value;
  if (!name) {
    return alert('이름을 입력하세요');
  }
  if (!age) {
    return alert('나이를 입력하세요');
  }
  try {
    await axios.post('/users', { name, age, phone, mbti });
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = '';
  e.target.age.value = '';
  e.target.phone.value = '';
  e.target.mbti.value = '';
});

async function login(id){
  try{
    const res = await axios.get(`/users/${id}`);
  } catch(err) {
    console.error(err);
  }
}