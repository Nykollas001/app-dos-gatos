import sys
from datetime import datetime
from PyQt6.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel,
    QVBoxLayout, QHBoxLayout, QTextEdit, QLineEdit
)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont


# =========================
# 📜 Dev Console
# =========================
class DevConsole(QWidget):
    def __init__(self, parent):
        super().__init__(parent)
        self.parent = parent

        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.setAttribute(Qt.WidgetAttribute.WA_StyledBackground, True)

        layout = QVBoxLayout()

        self.output = QTextEdit()
        self.output.setReadOnly(True)
        self.output.setFont(QFont("Consolas", 15))

        self.input = QLineEdit()
        self.input.setFont(QFont("Consolas", 15))
        self.input.setPlaceholderText("Digite um comando...")
        self.input.returnPressed.connect(self.process_command)

        layout.addWidget(self.output)
        layout.addWidget(self.input)
        self.setLayout(layout)

        self.hide()

    def resize_console(self):
        h = int(self.parent.height() * 0.35)
        self.setGeometry(0, 0, self.parent.width(), h)
        self.input.setFocus()
        self.parent.add_log("Console aberto")

    def process_command(self):
        command = self.input.text().strip()
        timestamp = datetime.now().strftime("%H:%M:%S")

        if command == "/quit":
            self.parent.add_log("Aplicação encerrada via console")
            QApplication.quit()

        elif command == "/viewLog":
            self.output.clear()
            for log in self.parent.logs:
                self.output.append(
                    f"<span style='font-size:11px;'>[{log}]</span>"
                )

        else:
            self.output.append(
                f"<span style='font-size:11px;'>[{timestamp}] Comando inválido</span>"
            )

        self.input.clear()

    def keyPressEvent(self, event):
        if event.key() == Qt.Key.Key_F8:
            self.parent.add_log("Console fechado")
            self.hide()
        else:
            super().keyPressEvent(event)


# =========================
# 🪟 Popup
# =========================
class Popup(QWidget):
    def __init__(self, texto, theme, parent):
        super().__init__()
        self.parent = parent

        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.showFullScreen()

        bg = "#ffffff" if theme == "light" else "#0f0f0f"
        fg = "#111111" if theme == "light" else "#ffffff"

        self.setStyleSheet(f"""
            QWidget {{
                background-color: {bg};
            }}
            QPushButton {{
                background-color: #e5e5e5;
                border-radius: 16px;
                padding: 12px 25px;
                font-size: 16px;
            }}
        """)

        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        label = QLabel(texto)
        label.setFont(QFont("Segoe UI", 42))
        label.setStyleSheet(f"color: {fg};")
        label.setAlignment(Qt.AlignmentFlag.AlignCenter)

        fechar = QPushButton("Fechar")
        fechar.clicked.connect(self.close_popup)

        layout.addWidget(label)
        layout.addSpacing(40)
        layout.addWidget(fechar)

        self.setLayout(layout)

    def close_popup(self):
        self.parent.add_log("Popup fechado")
        self.close()


# =========================
# 🏠 Main Window
# =========================
class MainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.logs = []
        self.theme = "light"

        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.showFullScreen()

        self.main_layout = QVBoxLayout()

        # 🔝 Top Bar
        top_bar = QHBoxLayout()

        self.theme_btn = QPushButton("🌙")
        self.theme_btn.setFixedSize(38, 38)
        self.theme_btn.clicked.connect(self.toggle_theme)

        self.close_btn = QPushButton("✕")
        self.close_btn.setFixedSize(38, 38)
        self.close_btn.clicked.connect(self.close_app)

        top_bar.addWidget(self.theme_btn)
        top_bar.addStretch()
        top_bar.addWidget(self.close_btn)

        # 🎯 Centro
        center_layout = QVBoxLayout()
        center_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.title = QLabel("Menu dos Gatos")
        self.title.setFont(QFont("Segoe UI", 36))
        self.title.setAlignment(Qt.AlignmentFlag.AlignCenter)

        botoes_layout = QHBoxLayout()
        botoes_layout.setSpacing(80)
        botoes_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.btn1 = QPushButton("🐈‍⬛")
        self.btn2 = QPushButton("🐈")

        self.btn1.setFont(QFont("Segoe UI Emoji", 40))
        self.btn2.setFont(QFont("Segoe UI Emoji", 40))

        self.btn1.setFixedSize(180, 180)
        self.btn2.setFixedSize(180, 180)

        self.btn1.clicked.connect(lambda: self.abrir_popup("🐈‍⬛ Gato Preto"))
        self.btn2.clicked.connect(lambda: self.abrir_popup("🐈 Gato Branco"))

        botoes_layout.addWidget(self.btn1)
        botoes_layout.addWidget(self.btn2)

        center_layout.addWidget(self.title)
        center_layout.addSpacing(80)
        center_layout.addLayout(botoes_layout)

        # 🔻 Rodapé
        bottom_bar = QHBoxLayout()
        bottom_bar.addStretch()

        self.author = QLabel("by Nykollas Guimarães")
        self.author.setStyleSheet("font-size:13px; color: gray;")

        bottom_bar.addWidget(self.author)

        self.main_layout.addLayout(top_bar)
        self.main_layout.addLayout(center_layout)
        self.main_layout.addStretch()
        self.main_layout.addLayout(bottom_bar)

        self.setLayout(self.main_layout)

        self.console = DevConsole(self)
        self.apply_theme()

        self.add_log("Aplicação iniciada (modo diurno)")

    # =========================
    # 📜 LOG
    # =========================
    def add_log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.logs.append(f"{timestamp} - {message}")

    # =========================
    # 🎨 Tema
    # =========================
    def toggle_theme(self):
        self.theme = "dark" if self.theme == "light" else "light"
        mode = "Modo escuro ativado" if self.theme == "dark" else "Modo claro ativado"
        self.add_log(mode)
        self.theme_btn.setText("☀" if self.theme == "dark" else "🌙")
        self.apply_theme()

    def apply_theme(self):
        if self.theme == "light":
            self.setStyleSheet("""
                QWidget { background-color: #f7f7f7; color: #111; }
                QPushButton {
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 30px;
                }
                QPushButton:hover {
                    background-color: #f0f0f0;
                }
            """)
        else:
            self.setStyleSheet("""
                QWidget { background-color: #121212; color: white; }
                QPushButton {
                    background-color: #1e1e1e;
                    border: 1px solid #333;
                    border-radius: 30px;
                    color: white;
                }
                QPushButton:hover {
                    background-color: #2a2a2a;
                }
            """)

    # =========================
    # 🪟 Popup
    # =========================
    def abrir_popup(self, texto):
        self.add_log(f"Popup aberto: {texto}")
        self.popup = Popup(texto, self.theme, self)
        self.popup.show()

    # =========================
    # ❌ Fechar
    # =========================
    def close_app(self):
        self.add_log("Aplicação encerrada pelo botão")
        QApplication.quit()

    # =========================
    # ⌨️ F8
    # =========================
    def keyPressEvent(self, event):
        if event.key() == Qt.Key.Key_F8:
            if self.console.isVisible():
                self.console.hide()
                self.add_log("Console fechado")
            else:
                self.console.resize_console()
                self.console.show()
        else:
            super().keyPressEvent(event)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())