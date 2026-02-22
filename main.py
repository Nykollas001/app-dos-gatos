"""
🐾 Menu de Menus 2.0 - Versão Corrigida e Robusta
Desenvolvido com KivyMD para Material Design
Autor: Nykollas Guimarães

CORREÇÕES IMPLEMENTADAS:
✅ Proteção contra KeyError em IDs
✅ Validação de layout carregado
✅ Clock.schedule_once para sincronização
✅ Tratamento de exceções robusto
✅ Código profissional e estável
"""

import os
import json
import random
import socket
from datetime import datetime, timedelta
from kivy.config import Config

# Configurar tamanho da janela ANTES de importar outros módulos
Config.set('graphics', 'width', '360')
Config.set('graphics', 'height', '640')
Config.set('graphics', 'resizable', '0')

from kivy.lang import Builder
from kivy.core.window import Window
from kivy.properties import StringProperty
from kivy.clock import Clock
from kivymd.app import MDApp
from kivymd.uix.dialog import MDDialog
from kivymd.uix.button import MDRaisedButton
from kivymd.uix.textfield import MDTextField
from kivymd.uix.boxlayout import MDBoxLayout

# Design em KV Language - VERSÃO CORRIGIDA
KV = '''
#:kivy 2.0

MDScreen:
    name: "main"
    md_bg_color: app.theme_cls.bg_normal

    # Barra Superior com Usuário
    MDBoxLayout:
        orientation: 'horizontal'
        size_hint_y: None
        height: "60dp"
        pos_hint: {"top": 1}
        padding: "10dp"
        spacing: "10dp"

        MDLabel:
            text: f"👤 {app.current_user_name}"
            theme_text_color: "Primary"
            bold: True
            size_hint_x: 0.6

        MDIconButton:
            icon: "weather-night" if app.theme_cls.theme_style == "Light" else "weather-sunny"
            on_release: app.toggle_theme()
        
        MDIconButton:
            icon: "logout"
            on_release: app.logout()

    # Conteúdo Central - Menus
    MDBoxLayout:
        orientation: 'vertical'
        spacing: "10dp"
        padding: "15dp"

        # Abas de Navegação
        MDBoxLayout:
            orientation: 'horizontal'
            spacing: "5dp"
            size_hint_y: None
            height: "50dp"

            MDRaisedButton:
                text: "🎮 Jogos"
                on_release: app.show_games_menu()
                size_hint_x: 0.5

            MDRaisedButton:
                text: "🐱 Gatos"
                on_release: app.show_cats_menu()
                size_hint_x: 0.5

        # Área de Conteúdo
        ScrollView:
            MDBoxLayout:
                id: content_area
                orientation: 'vertical'
                spacing: "15dp"
                padding: "10dp"
                adaptive_height: True

                MDLabel:
                    text: "Bem-vindo ao Menu de Menus 2.0!"
                    halign: "center"
                    font_style: "H5"
                    size_hint_y: None
                    height: "50dp"

    # Console F8 (Estilo FiveM) - CORRIGIDO
    MDBoxLayout:
        id: dev_console
        orientation: 'vertical'
        padding: "10dp"
        size_hint_y: 0.4
        pos_hint: {"top": 1}
        opacity: 0
        disabled: True
        canvas.before:
            Color:
                rgba: 0.02, 0.02, 0.05, 0.95
            Rectangle:
                pos: self.pos
                size: self.size
        
        MDLabel:
            text: "🖥️ CONSOLE (F8) - Pressione F1 para Debug"
            theme_text_color: "Custom"
            text_color: 0.0, 1.0, 0.0, 1
            size_hint_y: None
            height: "25dp"
            font_size: "12sp"

        ScrollView:
            MDLabel:
                id: console_output
                text: app.console_logs
                theme_text_color: "Custom"
                text_color: 0.0, 1.0, 0.0, 1
                size_hint_y: None
                height: self.texture_size[1]
                valign: "top"
                font_size: "11sp"

        MDBoxLayout:
            orientation: 'horizontal'
            size_hint_y: None
            height: "50dp"
            spacing: "5dp"
            
            MDTextField:
                id: console_input
                hint_text: "Digite comando (ex: help, debug, stats, user @admin, quit)"
                on_text_validate: app.submit_console_command()
                size_hint_x: 0.85
                height: "50dp"
                font_size: "12sp"
                multiline: False
            
            MDRaisedButton:
                text: "Enviar"
                on_release: app.submit_console_command()
                size_hint_x: 0.15
                height: "50dp"
                font_size: "12sp"
'''

class GatoApp(MDApp):
    console_logs = StringProperty("")
    current_user_name = StringProperty("Visitante")
    current_user_id = StringProperty("")
    current_user_color = StringProperty("roxo")
    current_user_role = StringProperty("User")
    current_user_points = StringProperty("0")
    current_user_ip = StringProperty("127.0.0.1")
    current_user_login_time = None
    
    def build(self):
        self.theme_cls.primary_palette = "DeepPurple"
        self.theme_cls.theme_style = "Light"
        self.dialog = None
        self.secret_number = random.randint(1, 10)
        self.guesses = 0
        
        self.users_db = {
            "admin": {
                "id": "usr_admin_001",
                "name": "Admin Central",
                "role": "CEO",
                "color": "roxo",
                "colorCode": "#8B00FF",
                "points": 10000,
                "ip": "127.0.0.1",
                "login_time": datetime.now()
            },
            "nykollas": {
                "id": "usr_5432",
                "name": "Nykollas",
                "role": "Usuário Comum",
                "color": "azul",
                "colorCode": "#0066FF",
                "points": 0,
                "ip": "192.168.1.100",
                "login_time": datetime.now()
            },
            "test": {
                "id": "usr_9999",
                "name": "Test User",
                "role": "Usuário Comum",
                "color": "verde",
                "colorCode": "#00CC00",
                "points": 0,
                "ip": "10.0.0.1",
                "login_time": datetime.now()
            }
        }
        
        screen = Builder.load_string(KV)
        Window.bind(on_key_down=self.on_keyboard_down)
        Clock.schedule_once(self._init_app, 0.1)
        Clock.schedule_interval(self._update_active_time, 1)
        
        return screen
    
    def _init_app(self, dt):
        self.show_login_screen()
    
    def _update_active_time(self, dt):
        pass
    
    def get_local_ip(self):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "127.0.0.1"
    
    def format_uptime(self, login_time):
        if login_time is None:
            return "00:00:00"
        
        try:
            elapsed = datetime.now() - login_time
            hours, remainder = divmod(int(elapsed.total_seconds()), 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        except:
            return "00:00:00"
    
    def show_login_screen(self):
        content = MDBoxLayout(orientation='vertical', spacing='15dp', padding='20dp')
        
        username_field = MDTextField(hint_text="Usuário", size_hint_y=None, height='50dp')
        password_field = MDTextField(hint_text="Senha", password=True, size_hint_y=None, height='50dp')
        
        def login_action(instance):
            username = username_field.text
            password = password_field.text
            
            if username and password:
                self.login_user(username, password)
                if self.dialog:
                    self.dialog.dismiss()
            else:
                self.add_log("❌ Preencha todos os campos")
        
        def register_action(instance):
            self.show_register_screen()
            if self.dialog:
                self.dialog.dismiss()
        
        content.add_widget(username_field)
        content.add_widget(password_field)
        
        buttons_layout = MDBoxLayout(size_hint_y=None, height='50dp', spacing='10dp')
        buttons_layout.add_widget(MDRaisedButton(text="LOGIN", on_release=login_action, size_hint_x=0.5))
        buttons_layout.add_widget(MDRaisedButton(text="REGISTRAR", on_release=register_action, size_hint_x=0.5))
        
        content.add_widget(buttons_layout)
        
        self.dialog = MDDialog(
            title="🔐 Login",
            type="custom",
            content_cls=content,
            size_hint=(0.9, 0.6)
        )
        self.dialog.open()
    
    def show_register_screen(self):
        content = MDBoxLayout(orientation='vertical', spacing='15dp', padding='20dp')
        
        username_field = MDTextField(hint_text="Usuário", size_hint_y=None, height='50dp')
        password_field = MDTextField(hint_text="Senha", password=True, size_hint_y=None, height='50dp')
        name_field = MDTextField(hint_text="Nome", size_hint_y=None, height='50dp')
        
        def register_action(instance):
            username = username_field.text
            password = password_field.text
            name = name_field.text
            
            if username and password and name:
                self.register_user(username, password, name)
                if self.dialog:
                    self.dialog.dismiss()
                self.show_login_screen()
            else:
                self.add_log("❌ Preencha todos os campos")
        
        content.add_widget(username_field)
        content.add_widget(password_field)
        content.add_widget(name_field)
        content.add_widget(MDRaisedButton(text="REGISTRAR", on_release=register_action, size_hint_y=None, height='50dp'))
        
        self.dialog = MDDialog(
            title="📝 Registrar",
            type="custom",
            content_cls=content,
            size_hint=(0.9, 0.7)
        )
        self.dialog.open()
    
    def login_user(self, username, password):
        if username == "hostadmin.ni" and password == "admin":
            self.current_user_name = "Admin Central"
            self.current_user_id = "usr_admin_001"
            self.current_user_color = "roxo"
            self.current_user_role = "CEO"
            self.current_user_points = "10000"
            self.current_user_ip = self.get_local_ip()
            self.current_user_login_time = datetime.now()
            self.add_log(f"✅ Login bem-sucedido: {username}")
        else:
            self.add_log(f"❌ Credenciais inválidas")
    
    def register_user(self, username, password, name):
        random_color_id = random.randint(1, 9)
        colors = ["azul", "verde", "rosa", "roxo", "amarelo", "vermelho", "laranja", "preto", "branco"]
        color = colors[random_color_id - 1]
        
        self.current_user_name = name
        self.current_user_id = f"usr_{random.randint(1000, 9999)}"
        self.current_user_color = color
        self.current_user_role = "Usuário Comum"
        self.current_user_points = "0"
        self.current_user_ip = self.get_local_ip()
        self.current_user_login_time = datetime.now()
        
        self.add_log(f"✅ Usuário registrado: {name}")
        self.add_log(f"🎨 Cor atribuída: {color}")
    
    def show_games_menu(self):
        content = MDBoxLayout(orientation='vertical', spacing='10dp', padding='15dp')
        
        content.add_widget(MDRaisedButton(
            text="🔢 Número Secreto (1-10)",
            on_release=lambda x: self.start_number_game(),
            size_hint_y=None,
            height='50dp'
        ))
        
        content.add_widget(MDRaisedButton(
            text="🎁 GIF Secreto de Gatos",
            on_release=lambda x: self.start_gif_game(),
            size_hint_y=None,
            height='50dp'
        ))
        
        content.add_widget(MDRaisedButton(
            text="🃏 Cartas Aleatórias",
            on_release=lambda x: self.start_cards_game(),
            size_hint_y=None,
            height='50dp'
        ))
        
        self.dialog = MDDialog(
            title="🎮 Menu de Jogos",
            type="custom",
            content_cls=content,
            size_hint=(0.9, 0.6)
        )
        self.dialog.open()
    
    def show_cats_menu(self):
        content = MDBoxLayout(orientation='vertical', spacing='10dp', padding='15dp')
        
        content.add_widget(MDRaisedButton(
            text="🐈‍⬛ Gato Preto",
            on_release=lambda x: self.show_cat_info("🐈‍⬛ Gato Preto"),
            size_hint_y=None,
            height='50dp'
        ))
        
        content.add_widget(MDRaisedButton(
            text="🐈 Gato Branco",
            on_release=lambda x: self.show_cat_info("🐈 Gato Branco"),
            size_hint_y=None,
            height='50dp'
        ))
        
        self.dialog = MDDialog(
            title="🐱 Menu de Gatos",
            type="custom",
            content_cls=content,
            size_hint=(0.9, 0.5)
        )
        self.dialog.open()
    
    def start_number_game(self):
        self.secret_number = random.randint(1, 10)
        self.guesses = 0
        if self.dialog:
            self.dialog.dismiss()
        self.add_log("🎮 Jogo iniciado: Adivinhe o número de 1 a 10!")
        
        content = MDBoxLayout(orientation='vertical', spacing='10dp', padding='15dp')
        guess_field = MDTextField(hint_text="Digite um número", input_filter='int', size_hint_y=None, height='50dp')
        
        def check_guess(instance):
            try:
                guess = int(guess_field.text)
                self.guesses += 1
                
                if guess == self.secret_number:
                    self.add_log(f"🎉 Acertou em {self.guesses} tentativa(s)! Ganhou 100 pontos!")
                    if self.dialog:
                        self.dialog.dismiss()
                elif guess < self.secret_number:
                    self.add_log(f"📈 Muito baixo! Tente um número maior.")
                else:
                    self.add_log(f"📉 Muito alto! Tente um número menor.")
                
                guess_field.text = ""
            except ValueError:
                self.add_log("❌ Digite um número válido")
        
        content.add_widget(guess_field)
        content.add_widget(MDRaisedButton(text="CHUTAR", on_release=check_guess, size_hint_y=None, height='50dp'))
        
        self.dialog = MDDialog(
            title="🔢 Número Secreto",
            type="custom",
            content_cls=content,
            size_hint=(0.9, 0.5)
        )
        self.dialog.open()
    
    def start_gif_game(self):
        gifs = [
            "🐱 Gatinho feliz pulando",
            "😺 Gato dormindo",
            "🐈 Gato correndo",
            "😸 Gato brincando",
            "🐱‍👓 Gato inteligente"
        ]
        
        secret_gif = random.choice(gifs)
        self.add_log(f"🎁 GIF Secreto: {secret_gif}")
        if self.dialog:
            self.dialog.dismiss()
    
    def start_cards_game(self):
        cards = ["♠️ Ás", "♥️ Rei", "♦️ Rainha", "♣️ Valete", "🃏 Coringa"]
        card = random.choice(cards)
        self.add_log(f"🃏 Carta sorteada: {card}")
        if self.dialog:
            self.dialog.dismiss()
    
    def show_cat_info(self, cat_name):
        descriptions = {
            "🐈‍⬛ Gato Preto": "Um gato preto misterioso e elegante!",
            "🐈 Gato Branco": "Um gato branco puro e carinhoso!"
        }
        
        if self.dialog:
            self.dialog.dismiss()
        self.add_log(f"🐱 {cat_name}: {descriptions.get(cat_name, 'Gatinho adorável!')}")
    
    def logout(self):
        self.current_user_name = "Visitante"
        self.current_user_id = ""
        self.current_user_login_time = None
        self.add_log("👋 Logout realizado")
        self.show_login_screen()
    
    def toggle_theme(self):
        new_theme = "Dark" if self.theme_cls.theme_style == "Light" else "Light"
        self.theme_cls.theme_style = new_theme
        self.add_log(f"🎨 Tema alterado para: {new_theme}")
    
    def add_log(self, message):
        try:
            timestamp = datetime.now().strftime("%H:%M:%S")
            self.console_logs += f"[{timestamp}] {message}\n"
        except Exception as e:
            print(f"Erro ao adicionar log: {e}")
    
    def show_debug_info(self):
        debug_info = f"""
═══════════════════════════════════════════
    🖥️ DEBUG CONSOLE v2.0
═══════════════════════════════════════════
👤 Usuário: {self.current_user_name}
🆔 ID: {self.current_user_id}
🎨 Cor: {self.current_user_color}
💰 Pontos: {self.current_user_points}
👑 Role: {self.current_user_role}
🌐 IP: {self.current_user_ip}
⏰ Hora: {datetime.now().strftime("%H:%M:%S")}
📱 App: Menu de Menus 2.0
✅ Status: Online
═══════════════════════════════════════════
"""
        self.add_log(debug_info)
    
    def show_user_profile(self, username):
        username = username.lower()
        
        if username not in self.users_db:
            self.add_log(f"❌ Usuário '{username}' não encontrado")
            return
        
        user = self.users_db[username]
        uptime = self.format_uptime(user.get("login_time"))
        entry_time = user.get("login_time").strftime("%H:%M:%S") if user.get("login_time") else "N/A"
        
        profile_info = f"""
═══════════════════════════════════════════
    👤 PERFIL DO USUÁRIO
═══════════════════════════════════════════
👤 Nome: {user['name']}
🆔 ID: {user['id']}
📝 Cargo: {user['role']}
🌐 IP: {user['ip']}
⏰ Entrada: {entry_time}
⏱️ Tempo Ativo: {uptime}
✅ Status: Online
💰 Pontos: {user['points']}
🎨 Cor: {user['color']} ({user['colorCode']})
═══════════════════════════════════════════
"""
        self.add_log(profile_info)
    
    def on_keyboard_down(self, window, key, scancode, codepoint, modifier):
        try:
            if key == 289:  # F8
                if self.root and 'dev_console' in self.root.ids:
                    console = self.root.ids.dev_console
                    console.disabled = not console.disabled
                    console.opacity = 1 if not console.disabled else 0
                    
                    if not console.disabled:
                        Clock.schedule_once(lambda dt: self._focus_console_input(), 0.05)
                        self.add_log("✅ Console Aberto (F1 para Debug)")
                return True
            
            elif key == 282:  # F1
                self.show_debug_info()
                return True
        
        except Exception as e:
            self.add_log(f"⚠️ Erro ao processar teclado: {e}")
        
        return False
    
    def _focus_console_input(self):
        try:
            if self.root and 'console_input' in self.root.ids:
                self.root.ids.console_input.focus = True
        except Exception as e:
            self.add_log(f"⚠️ Erro ao focar console_input: {e}")
    
    def submit_console_command(self):
        """Função para enviar comando do console (chamada pelo botão ou Enter)"""
        try:
            if self.root and 'console_input' in self.root.ids:
                text = self.root.ids.console_input.text.strip()
                if text:
                    self.process_command(text)
                    self.root.ids.console_input.text = ""
        except Exception as e:
            self.add_log(f"❌ Erro ao enviar comando: {e}")
    
    def process_command(self, command):
        try:
            cmd = command.strip().lower()
            
            if cmd.startswith('/'):
                cmd = cmd[1:]
            
            self.add_log(f"> {command}")
            
            if cmd.startswith("user @"):
                username = cmd.replace("user @", "").strip()
                self.show_user_profile(username)
            
            elif cmd in ["quit", "q", "exit"]:
                self.stop()
            elif cmd in ["clear", "cls", "c"]:
                self.console_logs = ""
                self.add_log("✅ Console limpo")
            elif cmd in ["help", "h", "?"]:
                self.add_log("""
📖 COMANDOS DISPONÍVEIS:
  help/h/?        - Mostra esta ajuda
  stats/st        - Mostra estatísticas
  debug/dbg       - Mostra informações de debug
  user @username  - Mostra perfil do usuário
  clear/cls/c     - Limpa console
  quit/q/exit     - Encerra app
  
💡 Dica: Comandos funcionam com ou sem barra (/)
Exemplo: /help ou help
Exemplo: /user @admin ou user @admin
""")
            elif cmd in ["stats", "st"]:
                self.add_log(f"""
📊 ESTATÍSTICAS:
  👤 Usuário: {self.current_user_name}
  💰 Pontos: {self.current_user_points}
  👑 Role: {self.current_user_role}
  🎨 Cor: {self.current_user_color}
""")
            elif cmd in ["debug", "dbg"]:
                self.show_debug_info()
            else:
                self.add_log(f"❌ Comando desconhecido: {cmd} (Digite 'help' para ajuda)")
        
        except Exception as e:
            self.add_log(f"❌ Erro ao processar comando: {e}")

if __name__ == "__main__":
    GatoApp().run()
