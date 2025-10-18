// ===================== HIỆU ỨNG NEON INTRO =====================
function createNeonText(text, container) {
  container.innerHTML = '';
  const chars = text.split('');
  chars.forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'neon-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.setProperty('--index', index);
    container.appendChild(span);
  });
}

createNeonText('Hola', document.getElementById('line1'));
createNeonText('Chúc mừng 20/10', document.getElementById('line2'));
createNeonText('Các bông hoa đã sẵn sàng chưa, click tiếp tục nhé', document.getElementById('line3'));

// ===================== NHẠC NỀN & GIAO DIỆN =====================
function startExperience() {
  document.getElementById('introScreen').classList.add('fade-out');
  document.getElementById('mainContainer').classList.add('show');
  
  const audio = document.getElementById('bgMusic');
  audio.volume = 0.7;
  
  audio.play().catch(() => {
    document.getElementById('toggleMusic').textContent = '▶️ Phát nhạc';
    isPlaying = false;
  });
  
  setTimeout(() => {
    document.getElementById('introScreen').style.display = 'none';
  }, 800);
}

const toggleBtn = document.getElementById('toggleMusic');
const volumeControl = document.getElementById('volumeControl');
const volumeText = document.getElementById('volumeText');
const songSelect = document.getElementById('songSelect');
const currentSongDisplay = document.getElementById('currentSong');
let isPlaying = true;

function updateCurrentSong() {
  const selectedOption = songSelect.options[songSelect.selectedIndex];
  currentSongDisplay.textContent = selectedOption.text;
}

songSelect.addEventListener('change', () => {
  const audio = document.getElementById('bgMusic');
  if (!audio) return;
  
  const wasPlaying = !audio.paused;
  audio.src = songSelect.value;
  audio.load();
  
  if (wasPlaying) {
    audio.play().catch(() => {
      toggleBtn.textContent = '▶️ Phát nhạc';
      isPlaying = false;
    });
  }
  updateCurrentSong();
});

toggleBtn.addEventListener('click', () => {
  const audio = document.getElementById('bgMusic');
  if (!audio) return;
  
  if (isPlaying) {
    audio.pause();
    toggleBtn.textContent = '▶️ Phát nhạc';
  } else {
    audio.play().catch(() => {
      alert('Vui lòng tương tác với trang để phát nhạc');
    });
    toggleBtn.textContent = '⏸️ Tạm dừng';
  }
  isPlaying = !isPlaying;
});

volumeControl.addEventListener('input', (e) => {
  const audio = document.getElementById('bgMusic');
  if (audio) audio.volume = e.target.value / 100;
  volumeText.textContent = e.target.value + '%';
});

updateCurrentSong();

// ===================== HIỆU ỨNG RƠI LÁ, LẤP LÁNH =====================
function createSparkles() {
  for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(sparkle);
  }
}

function createAutumnElements() {
  const elements = ['🍂', '🍁', '🍎'];
  setInterval(() => {
    const element = document.createElement('div');
    element.className = 'autumn-element';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDuration = (Math.random() * 3 + 5) + 's';
    element.style.opacity = Math.random() * 0.5 + 0.5;
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 8000);
  }, 500);
}

function createFlyingElements() {
  const elements = ['🍂', '🍎'];
  setInterval(() => {
    const element = document.createElement('div');
    element.className = 'flying-element';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * 100 + '%';
    element.style.bottom = '0';
    element.style.animationDelay = Math.random() + 's';
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 4000);
  }, 800);
}

// ===================== KẾT NỐI SUPABASE =====================
const SUPABASE_URL = "https://cfvywhpbeuvbgersdxar.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdnl3aHBiZXV2YmdlcnNkeGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTQ3NzUsImV4cCI6MjA3NjM3MDc3NX0.KD-gbTy1otZsD_LPMZX0qt3hNgyHm3QGm6wnDyKHzhE";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===================== GỬI LỜI CHÚC =====================
document.getElementById('wishForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const sender = document.getElementById('senderName').value.trim();
  const message = document.getElementById('wishMessage').value.trim();
  const wishType = document.querySelector('input[name="wishType"]:checked').value;
  const recipient = document.getElementById('recipientName').value.trim();

  if (!sender || !message) return alert("🍂 Vui lòng điền đầy đủ thông tin!");
  if (wishType === 'private' && !recipient) return alert("🍎 Vui lòng nhập tên người nhận!");

  try {
    if (wishType === 'public') {
      await db.from('Public_Messages').insert([{ sender, message }]);
      alert("✨ Lời chúc công khai của bạn đã được gửi!");
      loadPublicWishes();
    } else {
      await db.from('Private_Messages').insert([{ sender, recipient, message }]);
      alert(`🍎 Lời chúc riêng đã gửi đến ${recipient}!`);
    }
  } catch (err) {
    console.error("Lỗi gửi:", err);
    alert("❌ Gửi thất bại!");
  }

  // reset form
  document.getElementById('wishForm').reset();
  document.getElementById('recipientGroup').style.display = 'none';
});

// ===================== TẢI LỜI CHÚC CÔNG KHAI =====================
async function loadPublicWishes() {
  const container = document.getElementById('wishesContainer');
  container.innerHTML = '<p class="no-wishes">⏳ Đang tải lời chúc...</p>';

  const { data, error } = await db
    .from('Public_Messages')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = '<p class="no-wishes">⚠️ Không thể tải lời chúc!</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="no-wishes">🍃 Chưa có lời chúc nào!</p>';
    return;
  }

  container.innerHTML = data.map(w => `
    <div class="wish-item">
      <div class="name">💌 ${w.sender}</div>
      <div class="message">${w.message}</div>
      <div class="time">${new Date(w.created_at).toLocaleString('vi-VN')}</div>
    </div>
  `).join('');
}

// ===================== XEM LỜI CHÚC RIÊNG =====================
async function checkPrivateWishes() {
  const checkName = document.getElementById('checkName').value.trim();
  if (!checkName) return alert('🍂 Vui lòng nhập tên của bạn!');

  const { data, error } = await db
    .from('Private_Messages')
    .select('*')
    .eq('recipient', checkName)
    .order('id', { ascending: false });

  const modal = document.getElementById('privateWishesModal');
  const container = document.getElementById('privateWishesContainer');
  const nameDisplay = document.getElementById('recipientNameDisplay');
  nameDisplay.textContent = checkName;

  if (error || !data || data.length === 0) {
    container.innerHTML = '<p class="no-wishes">🍎 Không có lời chúc nào dành cho bạn!</p>';
  } else {
    container.innerHTML = data.map(w => `
      <div class="wish-item">
        <div class="name">🍎 Từ: ${w.sender}</div>
        <div class="message">${w.message}</div>
        <div class="time">${new Date(w.created_at).toLocaleString('vi-VN')}</div>
      </div>
    `).join('');
  }

  openPrivateWishesModal();

}

// ===================== MODAL ẢNH =====================
function openPhotoModal() {
  const modal = document.getElementById('photoModal');
  modal.classList.add('active');
  setTimeout(() => createElementBurst(), 300);
}

function closePhotoModal() {
  document.getElementById('photoModal').classList.remove('active');
  document.querySelectorAll('.burst-element').forEach(e => e.remove());
}

function createElementBurst() {
  const modal = document.getElementById('photoModal');
  const elements = ['🍂', '🍁', '🍎'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const element = document.createElement('div');
      element.className = 'burst-element';
      element.textContent = elements[Math.floor(Math.random() * elements.length)];
      element.style.left = '50%';
      element.style.top = '50%';
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 200;
      element.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      element.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      modal.appendChild(element);
      setTimeout(() => element.remove(), 1000);
    }, i * 30);
  }
}



// ===================== KHỞI TẠO =====================
createSparkles();
createAutumnElements();
createFlyingElements();
loadPublicWishes();

document.querySelectorAll('input[name="wishType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const recipientGroup = document.getElementById('recipientGroup');
    const recipientName = document.getElementById('recipientName');
    if (e.target.value === 'private') {
      recipientGroup.style.display = 'block';
      recipientName.required = true;
    } else {
      recipientGroup.style.display = 'none';
      recipientName.required = false;
      recipientName.value = '';
    }
  });
});

function openPrivateWishesModal() {
  const modal = document.getElementById('privateWishesModal');
  modal.style.display = 'flex'; // hoặc 'block' tùy bạn CSS
  modal.classList.remove('fade-out');
  modal.offsetHeight; // ép reflow
  modal.classList.add('active');
}

function closePrivateWishesModal() {
  const modal = document.getElementById('privateWishesModal');
  modal.classList.remove('active');
  modal.classList.add('fade-out');

  // đợi animation kết thúc
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out');
  }, 300);
}


