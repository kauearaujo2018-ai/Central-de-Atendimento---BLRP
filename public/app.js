* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: #0b1220;
  color: #e5edf9;
}
button, input { font: inherit; }
button { cursor: pointer; }

.app-shell {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 260px;
  background: #111827;
  border-right: 1px solid #1f2937;
  padding: 24px 18px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 700;
}
.brand strong, .brand small { display: block; }
.brand small { color: #9ca3af; }
.nav-item {
  display: block;
  width: 100%;
  padding: 12px 14px;
  margin: 8px 0;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #dbeafe;
  text-align: left;
}
.nav-item.active {
  background: rgba(59,130,246,0.15);
  border-color: rgba(96,165,250,0.4);
}
.main-panel {
  flex: 1;
  padding: 28px;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.topbar h1 {
  margin: 0 0 4px;
  font-size: 2rem;
}
.topbar p { margin: 0; color: #9ca3af; }

.card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
}
.login-card {
  max-width: 420px;
  margin: 60px auto;
}
#loginForm,
.settings-form {
  display: grid;
  gap: 14px;
}
#loginForm label,
.settings-form label {
  display: grid;
  gap: 6px;
  color: #dbeafe;
}
input {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  color: white;
  padding: 10px 12px;
  border-radius: 10px;
}
.primary-btn, .secondary-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
}
.primary-btn {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  font-weight: 600;
}
.secondary-btn {
  background: #1f2937;
  color: white;
}
.hidden { display: none !important; }
.view { display: none; }
.view.active { display: block; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 16px;
  padding: 18px;
}
.stat-card .value {
  display: block;
  font-size: 2rem;
  margin-top: 10px;
  font-weight: 700;
}
.split-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.list li {
  background: rgba(15,23,42,0.9);
  border: 1px solid #243246;
  border-radius: 10px;
  padding: 10px 12px;
  color: #dbeafe;
}
.table-container {
  overflow: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 14px;
}
th, td {
  border-bottom: 1px solid #1f2937;
  padding: 10px 8px;
  text-align: left;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
