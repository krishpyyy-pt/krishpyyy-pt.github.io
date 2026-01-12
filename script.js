const windowIcons = {
  about: "assets/images/about_me.png",
  projects: "assets/images/Web-documents folder 2.ico",
  certificates: "assets/images/Certificate 2.ico",
  contact: "assets/images/Text in letter.ico",
  paint: "assets/images/mspaint.exe_14_2.ico",
  snake: "assets/images/snake-pixel-art-removebg.png",
  dos: "assets/images/Program Folder (16x16px & 32x32px).ico",
  blog: "assets/images/Book 2.ico",
  wallpapers: "assets/images/wallpaper.png",
  "case-files": "assets/images/Documents Folder.ico"
};
let portfolioData = {};
// Fetch data once when page loads
fetch('portfolioData.json')
  .then(res => res.json())
  .then(data => {
    portfolioData = data;
  })
  .catch(err => console.error("Error loading JSON:", err));

function loadContent(windowName) {
  const winBody = document.querySelector(`#${windowName}-window .window-body`);
  // The initial check is good, but we handle the null case inside each block now.
  if (!winBody) return; 

  // --- ABOUT SECTION ---
  if (windowName === "about") {
    // Check if the 'about' data is available
    if (portfolioData.about) {
      const { intro, bio, profiles } = portfolioData.about;
      winBody.innerHTML = `
      <div class="content-item">
        <h3>${intro}</h3>
        <p style = "font-size:12px">${bio}</p>
        <ul>
          ${profiles.map(p => `<li><a href="${p.url}" target="_blank">${p.label}</a></li>`).join("")}
        </ul>
        </div>
      `;
    } else {
      // Fallback if data hasn't loaded yet
      winBody.innerHTML = `<p>Loading details...</p>`;
    }
  }

  // --- PROJECTS SECTION ---
if (windowName === "projects") {
    if (portfolioData.projects) {
        // Clear previous content
        winBody.innerHTML = ''; 

        portfolioData.projects.forEach(p => {
            // Create each element manually
            const item = document.createElement('div');
            item.className = 'content-item';

            const title = document.createElement('h4');
            title.textContent = p.name; // Use .textContent to safely insert text

            const desc = document.createElement('p');
            desc.textContent = p.description; // .textContent prevents scripts from running

            const link = document.createElement('a');
            link.href = p.link;
            link.textContent = p.linktext || "View Code";
            link.target = '_blank'; // Good practice to open external links in a new tab

            // Append the new, safe elements
            item.appendChild(title);
            item.appendChild(desc);
            item.appendChild(link);
            winBody.appendChild(item);
        });
    }
}
  // --- CERTIFICATES SECTION ---
  if (windowName === "certificates") {
    // Check if the 'certificates' data is available
    if (portfolioData.certificates) {
      winBody.innerHTML = portfolioData.certificates.map(
        c => `
          <div class="content-item">
            <h4>${c.title}</h4>
            <p style = "font-size:12px">${c.organisation} - ${c.date}</p>
            <img src="${c.image}" alt="${c.title}">
          </div>
        `
      ).join("");
    } else {
      // Fallback if data hasn't loaded yet
      winBody.innerHTML = `<p>Loading certificates...</p>`;
    }
  }

  // --- CONTACT SECTION ---
  if (windowName === "contact") {
    // Check if the 'contact' data is available
    if (portfolioData.contact) {
      const { email, socials } = portfolioData.contact;
      winBody.innerHTML = `
      <div class="content-item">
        <p style = "font-size:12px">Email: <a href="mailto:${email}">${email}</a></p>
        <ul>
          ${socials.map(s => `<li><a href="${s.url}" target="_blank">${s.label}</a></li>`).join("")}
        </ul>
        </div>
      `;
    } else {
      // Fallback if data hasn't loaded yet
      winBody.innerHTML = `<p>Loading contact info...</p>`;
    }
  }
  // --- NEW CASE FILES SECTION ---
  if (windowName === "case-files") {
    if (portfolioData.caseFiles) {
      winBody.innerHTML = ''; // Clear previous content

      portfolioData.caseFiles.forEach(category => {
        // Create a heading for the category
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.category;
        winBody.appendChild(categoryTitle);

        // Create a list for the items in this category
        const itemList = document.createElement('ul');
        
        category.items.forEach(item => {
          // Create each item as a list item
          const listItem = document.createElement('li');
          listItem.style.marginBottom = '10px'; // Add some spacing

          // Use innerHTML for simple title and link
          listItem.innerHTML = `
            <a href="${item.link}" target="_blank">${item.title}</a>
            <p style="margin: 2px 0 0 0; font-size: 12px;">${item.description}</p>
          `;
          itemList.appendChild(listItem);
        });

        winBody.appendChild(itemList);
      });
    } else {
      winBody.innerHTML = `<p>Loading case files...</p>`;
    }
  }
}
let highestZIndex = 100; // for z-index
let clippyIndex = 0;
document.addEventListener("DOMContentLoaded", function () {
  // ✅ Fix: Ensure Start menu is hidden on load
  document.getElementById('start-menu').classList.add('hidden');
  document.getElementById('dos-window').style.display = 'none';
 // document.getElementById('recycle-window').classList.add('hidden');


  // Clock setup
  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    document.getElementById('clock').textContent = `${h}:${m} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Make windows draggable
  const desktop = document.querySelector('.crt-main');
  ['about', 'projects', 'certificates', 'contact', 'paint', 'dos', 'blog', 'snake','wallpapers','case-files'].forEach(id => {
    const win = document.getElementById(id + '-window');
    if (win) makeDraggable(win, desktop);
  });
  
  // Clippy Logic
  const clippyContainer = document.getElementById('clippy-container');
  const clippyText = document.getElementById('clippy-text');
  const clippyWelcome = "Hello! Welcome to Kavyansh's portfolio.";
const clippyMessages = [
  "It looks like you're exploring. You can open applications from the desktop icons or the Start Menu.",
  "Why not check out the Snake game? It's a classic!",
  "Have a great time!"
];

function startClippy() {
  clippyText.textContent = clippyWelcome;
  clippyContainer.classList.remove('hidden');

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * clippyMessages.length);
    clippyText.textContent = clippyMessages[randomIndex];
    clippyContainer.classList.remove('hidden');
  }, 30000);
}

startClippy();


  // DOS Logic
  const dosInput = document.getElementById('dos-input');
  if(dosInput) {
    dosInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const command = dosInput.value.toLowerCase().trim();
        const prompt = document.getElementById('dos-prompt').textContent;
        const dosOutput = document.getElementById('dos-output');
        dosOutput.innerHTML += `\n${prompt}${command}`;
        processDosCommand(command);
        dosInput.value = '';
        dosOutput.scrollTop = dosOutput.scrollHeight;
      }
    });
  }
  
  // Paint Logic
  const paintCanvas = document.getElementById('paint-canvas');
  if (paintCanvas) {
    const ctx = paintCanvas.getContext('2d');
    let painting = false;
    let prevX = 0, prevY = 0;

    paintCanvas.addEventListener('mousedown', (e) => {
      painting = true;
      const rect = paintCanvas.getBoundingClientRect();
      prevX = e.clientX - rect.left;
      prevY = e.clientY - rect.top;
    });

    paintCanvas.addEventListener('mousemove', (e) => {
      if (!painting) return;
      const rect = paintCanvas.getBoundingClientRect();
      const currX = e.clientX - rect.left;
      const currY = e.clientY - rect.top;

      const colorPicker = document.getElementById("brush-color");
      const sizeSelect = document.getElementById("brush-size-select");

      ctx.strokeStyle = isErasing ? '#FFFFFF' : colorPicker.value;
      ctx.lineWidth = sizeSelect.value;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currX, currY);
      ctx.stroke();

      prevX = currX;
      prevY = currY;
    });

    paintCanvas.addEventListener('mouseup', () => painting = false);
    paintCanvas.addEventListener('mouseleave', () => painting = false);

  }

  // --- NEW: Idle Timer for Screensaver ---
  resetIdleTimer();
  document.onmousemove = resetIdleTimer;
  document.onkeypress = resetIdleTimer;
  document.onmousedown = resetIdleTimer; 
});

// --- GLOBAL FUNCTIONS ---
// --- NEW: Screensaver and Idle Timer Logic ---
let idleTimer;

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showScreensaver,  3 * 60 * 1000); // 10 minutes
}
function showScreensaver() {
    const screensaver = document.getElementById('screensaver');
    const video = document.getElementById('screensaver-video');
    const crtMain = document.querySelector('.crt-main');

    // Get the CRT area size
    const rect = crtMain.getBoundingClientRect();
    video.style.width = rect.width + 'px';
    video.style.height = rect.height + 'px';

    screensaver.classList.remove('hidden');
    video.play();
    document.addEventListener('mousemove', hideScreensaverOnMove, { once: true });
}
function hideScreensaverOnMove() {
    const screensaver = document.getElementById('screensaver');
    const video = document.getElementById('screensaver-video');
    screensaver.classList.add('hidden');
    video.pause(); // Pause the video
    video.currentTime = 0; // Optional: Reset video to the beginning
    resetIdleTimer(); // Reset the timer once the user is active again
}
// --- End of New Logic ---

function hideClippy() {
  const clippyContainer = document.getElementById('clippy-container');
  clippyContainer.classList.add('hidden');
}

function toggleStartMenu(e) {
  const menu = document.getElementById('start-menu');
  menu.classList.toggle('hidden');
  e.stopPropagation();
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  const startButton = document.querySelector('.start-menu-button');
  if (!menu.contains(e.target) && !startButton.contains(e.target)) {
    menu.classList.add('hidden');
  }
});
function openWindow(id) {
  const win = document.getElementById(id + '-window');
  if (!win) return;

  win.classList.remove('hidden');
  win.style.display = (id === 'dos') ? 'grid' : 'block';
  if (id === 'dos') win.style.gridTemplateRows = 'auto 1fr';

  win.style.visibility = 'visible';
  win.style.top = win.dataset.top || '100px';
  win.style.left = win.dataset.left || '100px';
  highestZIndex++;
  win.style.zIndex = highestZIndex;

  const body = win.querySelector('.window-body');
  if (body) body.style.display = '';

  // Taskbar button logic
  let taskBtn = document.querySelector(`.taskbar-button[data-id="${id}"]`);
  if (!taskBtn) {
    taskBtn = document.createElement('button');
    taskBtn.className = 'window-button taskbar-button';
    taskBtn.dataset.id = id;
    const iconPath = windowIcons[id] || 'assets/images/Folder.ico';
    taskBtn.innerHTML = `<img src="${iconPath}" class="taskbar-icon"><span>${capitalize(id)}</span>`;
    taskBtn.onclick = () => toggleWindowFromTaskbar(id);
    document.querySelector('.taskbar-windows').appendChild(taskBtn);
  }

  document.querySelectorAll('.taskbar-button').forEach(btn => btn.classList.remove('active'));
  taskBtn.classList.add('active');

  // Load JSON content if applicable
  loadContent(id);

  // Special cases
  if (id === 'snake') initSnakeGame();
  if (id === 'dos') {
    const dosOutput = document.getElementById('dos-output');
    const dosInput = document.getElementById('dos-input');
    setTimeout(() => {
      dosOutput.innerHTML = 'Microsoft(R) Windows 95\n(C)Copyright Microsoft Corp 1981-1995.\n\nType "help" for a list of commands.';
      dosInput.focus();
    }, 1);
  }
}
function closeWindow(id) {
  const win = document.getElementById(id + '-window');
  win.style.display = 'none';

  if (id === 'snake') stopSnakeGame();

  const taskBtn = document.querySelector(`.taskbar-button[data-id="${id}"]`);
  if (taskBtn) taskBtn.remove();
}
function minimizeWindow(id) {
  const win = document.getElementById(id + '-window');
  const taskBtn = document.querySelector(`.taskbar-button[data-id="${id}"]`);
  if (!win || !taskBtn) return;

  const rect = win.getBoundingClientRect();
  const btnRect = taskBtn.getBoundingClientRect();
  const body = win.querySelector('.window-body');
  const desktopRect = document.querySelector('.crt-main').getBoundingClientRect();

  // Save original position and size
  win.dataset.top = win.style.top;
  win.dataset.left = win.style.left;
  win.dataset.width = win.style.width || '300px';
  win.dataset.height = win.style.height || 'auto';

  body.style.display = 'none';
  
  // Ensure window stays within bounds during animation
  const initialTop = Math.min(rect.top, desktopRect.bottom - 50);
  win.style.top = `${initialTop + 40}px`;

  let frame = 0;
  const totalFrames = 12;

  const winCenterX = rect.left + rect.width / 2;
  const winCenterY = initialTop + 40 + 15;
  const targetX = btnRect.left + btnRect.width / 2;
  const targetY = btnRect.top + btnRect.height / 2;

  const dx = targetX - winCenterX;
  const dy = targetY - winCenterY;

  function animateStep() {
    if (frame > totalFrames) {
      win.style.transform = '';
      win.style.display = 'none';
      body.style.display = '';
      taskBtn.classList.remove('active');
      return;
    }

    const t = frame / totalFrames;
    const jitter = (Math.random() - 0.5) * 0.04;
    const scale = 1 - 0.7 * t + jitter;
    const x = dx * t;
    const y = dy * t;
    win.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    if (t >= 0.9 && win.style.visibility !== 'hidden') {
      win.style.visibility = 'hidden';
    }
    frame++;
    setTimeout(() => requestAnimationFrame(animateStep), 30);
  }

  setTimeout(() => {
    win.style.visibility = 'visible';
    requestAnimationFrame(animateStep);
  }, 200);
}
function maximizeWindow(id) {
  const win = document.getElementById(id + '-window');
  if (win.classList.contains('maximized')) {
    win.style.top = '100px';
    win.style.left = '100px';
    win.style.width = '300px';
    win.classList.remove('maximized');
  } else {
    win.style.top = '0';
    win.style.left = '0';
    win.style.width = '100%';
    win.classList.add('maximized');
  }
}
function makeDraggable(el, container) {
    const header = el.querySelector('.title-bar');
    if (!header) return;

    // Use a single function for starting the drag for both mouse and touch
    const startDrag = (e) => {
        if (el.classList.contains('maximized')) return;

        isDragging = true;
        highestZIndex++;
        el.style.zIndex = highestZIndex;
        document.body.style.userSelect = 'none'; // Prevent text selection

        const rect = el.getBoundingClientRect();
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        let offsetX = clientX - rect.left;
        let offsetY = clientY - rect.top;

        // --- MODIFIED LOGIC ---
        // These listeners are now ADDED on drag start
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        function drag(e) {
            if (e.type.startsWith('touch')) {
                e.preventDefault(); // Prevent page from scrolling on mobile
            }

            const containerRect = container.getBoundingClientRect();
            const winWidth = el.offsetWidth;
            const winHeight = el.offsetHeight;

            const currentClientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            const currentClientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

            let newLeft = currentClientX - containerRect.left - offsetX;
            let newTop = currentClientY - containerRect.top - offsetY;

            // Constrain to container
            newLeft = Math.max(0, Math.min(newLeft, containerRect.width - winWidth));
            newTop = Math.max(0, Math.min(newTop, containerRect.height - winHeight));

            el.style.left = newLeft + 'px';
            el.style.top = newTop + 'px';
        }

        function endDrag() {
            document.body.style.userSelect = 'auto'; // Re-enable text selection

            // --- MODIFIED LOGIC ---
            // Crucially, we REMOVE the listeners when the drag ends
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
        }
    };

    header.addEventListener('mousedown', startDrag);
    header.addEventListener('touchstart', startDrag);
}
function toggleWindowFromTaskbar(id) {
  const win = document.getElementById(id + '-window');
  const taskBtn = document.querySelector(`.taskbar-button[data-id="${id}"]`);
  if (!win || !taskBtn) return;

  if (win.style.display === 'none' || win.style.visibility === 'hidden') {
    const body = win.querySelector('.window-body');
    body.style.display = 'none';
    win.style.display = 'block';
    win.style.visibility = 'visible';
    const btnRect = taskBtn.getBoundingClientRect();
    const desktopRect = document.querySelector('.crt-main').getBoundingClientRect();
    const startX = btnRect.left + btnRect.width / 2 - desktopRect.left;
    const startY = btnRect.top + btnRect.height / 2 - desktopRect.top;
    const finalLeft = parseInt(win.dataset.left || 100);
    const finalTop = parseInt(win.dataset.top || 100);
    const winWidth = win.offsetWidth;
    const originX = finalLeft + winWidth / 2;
    const originY = finalTop + 15;
    const dx = originX - startX;
    const dy = originY - startY;
    win.style.left = `${finalLeft}px`;
    win.style.top = `${finalTop}px`;
    win.style.transformOrigin = 'center top';
    win.style.transform = `translate(${-dx}px, ${-dy}px) scale(0.3)`;
    let frame = 0;
    const totalFrames = 12;

    function animateStep() {
      if (frame > totalFrames) {
        win.style.transform = '';
        body.style.display = '';
        taskBtn.classList.add('active');
        return;
      }
      const t = frame / totalFrames;
      const jitter = (Math.random() - 0.5) * 0.04;
      const scale = 0.3 + (0.7 * t) + jitter;
      const x = -dx * (1 - t);
      const y = -dy * (1 - t);
      win.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      frame++;
      setTimeout(() => requestAnimationFrame(animateStep), 30);
    }
    requestAnimationFrame(animateStep);
  } else {
    minimizeWindow(id);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
let isErasing = false;
function toggleEraser() {
    isErasing = !isErasing;
    const eraserBtn = document.getElementById('eraser-btn');
    eraserBtn.textContent = isErasing ? 'Eraser: On' : 'Eraser: Off';
}

function clearCanvas() {
  const canvas = document.getElementById("paint-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function processDosCommand(command) {
    const dosOutput = document.getElementById('dos-output');

    // Helper function to safely add a new line of text
    function appendOutput(text) {
        const line = document.createElement('div');
        line.textContent = text; // Using .textContent is the key to preventing XSS
        dosOutput.appendChild(line);
    }

    let outputText = '';

    switch (command) {
        case 'help':
            outputText = `Available commands:\n  help      - Shows this list\n  about     - Displays information about me\n  projects  - Opens the projects folder\n  contact   - Shows contact information\n  snake     - Runs the snake game\n  clear     - Clears the screen`;
            // The output here contains newlines, so we'll handle it specially
            outputText.split('\n').forEach(line => appendOutput(line));
            break;
        case 'about':
            openWindow('about');
            appendOutput(`Opening About Me...`);
            break;
        case 'projects':
            openWindow('projects');
            appendOutput(`Opening Projects...`);
            break;
        case 'contact':
            openWindow('contact');
            appendOutput(`Opening Contact Me...`);
            break;
        case 'snake':
            openWindow('snake');
            appendOutput(`Launching Snake... Good luck!`);
            break;
        case 'clear':
            // Safely clear the output
            dosOutput.innerHTML = '';
            break;
        case '':
            // Do nothing if the command is empty
            break;
        default:
            // Safely display the unrecognized command
            appendOutput(`'${command}' is not recognized as an internal or external command.`);
            break;
    }

    // Ensure the output area scrolls to the bottom
    dosOutput.scrollTop = dosOutput.scrollHeight;
}

// --- 🐍 Snake Game Logic ---
let snakeGame = {
  canvas: null, ctx: null, gridSize: 20, snake: [], food: {},
  direction: 'right', nextDirection: 'right', score: 0,
  isGameOver: false, gameLoop: null
};

function restartSnakeGame() {
  stopSnakeGame();
  initSnakeGame();
}

function initSnakeGame() {
  snakeGame.canvas = document.getElementById('snake-canvas');
  if (!snakeGame.canvas) return;
  snakeGame.ctx = snakeGame.canvas.getContext('2d');
  snakeGame.snake = [{ x: 5, y: 5 }];
  snakeGame.direction = 'right';
  snakeGame.nextDirection = 'right';
  snakeGame.score = 0;
  snakeGame.isGameOver = false;
  document.getElementById('snake-score').textContent = 'SCORE: 0';
  placeFood();
  if (snakeGame.gameLoop) clearInterval(snakeGame.gameLoop);
  snakeGame.gameLoop = setInterval(updateSnakeGame, 150);
  document.removeEventListener('keydown', handleSnakeInput);
  document.addEventListener('keydown', handleSnakeInput);
}

function updateSnakeGame() {
  if (snakeGame.isGameOver) {
    clearInterval(snakeGame.gameLoop);
    snakeGame.ctx.fillStyle = '#3a3f34';
    snakeGame.ctx.font = '24px DOSVGA';
    snakeGame.ctx.textAlign = 'center';
    snakeGame.ctx.fillText('Game Over!', snakeGame.canvas.width / 2, snakeGame.canvas.height / 2);
    return;
  }
  snakeGame.direction = snakeGame.nextDirection;
  const head = { ...snakeGame.snake[0] };
  if (snakeGame.direction === 'right') head.x++;
  if (snakeGame.direction === 'left') head.x--;
  if (snakeGame.direction === 'up') head.y--;
  if (snakeGame.direction === 'down') head.y++;
  if (isCollision(head)) {
    snakeGame.isGameOver = true;
    return;
  }
  snakeGame.snake.unshift(head);
  if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
    snakeGame.score++;
    document.getElementById('snake-score').textContent = 'SCORE: ' + snakeGame.score;
    placeFood();
  } else {
    snakeGame.snake.pop();
  }
  drawSnakeGame();
}

function drawSnakeGame() {
  const { ctx, canvas, gridSize, snake, food } = snakeGame;
  ctx.fillStyle = '#c7d99f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#3a3f34';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function placeFood() {
  const { canvas, gridSize } = snakeGame;
  snakeGame.food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
  snakeGame.snake.forEach(segment => {
    if (segment.x === snakeGame.food.x && segment.y === snakeGame.food.y) {
      placeFood();
    }
  });
}

function handleSnakeInput(e) {
  const key = e.key;
  const { direction } = snakeGame;
  if (key === 'ArrowUp' && direction !== 'down') snakeGame.nextDirection = 'up';
  if (key === 'ArrowDown' && direction !== 'up') snakeGame.nextDirection = 'down';
  if (key === 'ArrowLeft' && direction !== 'right') snakeGame.nextDirection = 'left';
  if (key === 'ArrowRight' && direction !== 'left') snakeGame.nextDirection = 'right';
}

function isCollision(head) {
  const { canvas, gridSize, snake } = snakeGame;
  if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function stopSnakeGame() {
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
    }
    document.removeEventListener('keydown', handleSnakeInput);
}
function changeWallpaper(image) {
    const desktop = document.getElementById('desktop-area');
    if (image.startsWith('#')) {
        desktop.style.backgroundImage = 'none';
        desktop.style.backgroundColor = image;
    } else {
        desktop.style.backgroundImage = `url('${image}')`;
        desktop.style.backgroundSize = 'cover';
    }
}
// AFTER
function promptRestore(element) {
    // Get the item name from the data-name attribute
    const itemName = element.getAttribute('data-name');
    const messageElement = document.getElementById('restore-message');

    // Update the dialog's text to be specific
    if (messageElement && itemName) {
        messageElement.textContent = `Are you sure you want to restore "${itemName}.txt"?`;
    } else if (messageElement) {
        messageElement.textContent = `Are you sure you want to restore this file?`;
    }

    // Open the custom confirmation window
    openWindow('restore');
}

function showRck() {
  const overlay = document.getElementById('rck-overlay');
  const video = document.getElementById('rck-video');
  overlay.classList.remove('hidden');
  video.play();
}

function closeRck() {
  const overlay = document.getElementById('rck-overlay');
  const video = document.getElementById('rck-video');
  video.pause();
  video.currentTime = 0;
  overlay.classList.add('hidden');
}
// This function executes the restore and closes the dialog
function confirmRestore() {
  // Perform the action (the easter egg)
  showRck();

  // Close the confirmation window
  closeWindow('restore');
}
function shutdown() {
  openWindow('shutdown');
}

function confirmShutdown() {
  // Hide the confirmation window
  closeWindow('shutdown');

  // Hide the main portfolio interface
  const crtMain = document.querySelector('.crt-main');
  if (crtMain) {
    crtMain.style.display = 'none';
  }

  // Show the final shutdown screen
  const shutdownScreen = document.getElementById('shutdown-screen');
  if (shutdownScreen) {
    shutdownScreen.classList.remove('hidden');
  }
}

function suspendSystem() {
  openWindow('suspend');
}

function confirmSuspend() {
  closeWindow('suspend');
  const suspend = document.getElementById('suspend-screen');
  suspend.classList.remove('hidden');
  setTimeout(() => {
    document.addEventListener('keydown', resumeSystem);
    document.addEventListener('click', resumeSystem);
  }, 100);
}
// script.js, line 630
function resumeSystem() {
    // 🐛 Bug: 'suspend' is not defined here.
    // suspend.classList.add('hidden'); 

    // ✅ Fix: Get the element first.
    const suspend = document.getElementById('suspend-screen');
    suspend.classList.add('hidden');

    document.removeEventListener('keydown', resumeSystem);
    document.removeEventListener('click', resumeSystem);
}

