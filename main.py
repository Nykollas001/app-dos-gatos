"""
🐾 App dos Gatos v2.0 - Mobile Application
Desenvolvido com KivyMD para Material Design
Autor: Nykollas Guimarães
"""

import os
from datetime import datetime
from kivy.config import Config

# Configurações de janela (DEVE vir antes de outros imports)
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

# Design em KV Language
KV = '''
MDScreen:
    name: "main"
    md_bg_color: app.theme_cls.bg_normal

    # Barra Superior
    MDBoxLayout:
        orientation: 'horizontal'
        size_hint_y: None
        height: "60dp"
        pos_hint: {"top": 1}
        padding: "10dp"
        canvas.before:
            Color:
                rgba: app.theme_cls.primary_color + (0.1,)
            Rectangle:
                pos: self.pos
                size: self.size

        MDIconButton:
            icon: "weather-night" if app.theme_cls.theme_style == "Light" else "weather-sunny"
            on_release: app.toggle_theme()
            icon_size: "28sp"
        
        MDWidget:
        
        MDIconButton:
            icon: "close"
            on_release: app.stop()
            icon_size: "28sp"

    # Conteúdo Central
    MDBoxLayout:
        orientation: 'vertical'
        spacing: "20dp"
        padding: "20dp"
        pos_hint: {"center_x": .5, "center_y": .5}

        MDLabel:
            text: "🐾 App dos Gatos 2.0"
            halign: "center"
            font_style: "H4"
            theme_text_color: "Primary"
            bold: True
            size_hint_y: None
            height: "50dp"

        MDLabel:
            text: "Selecione um gatinho"
            halign: "center"
            theme_text_color: "Secondary"
            size_hint_y: None
            height: "30dp"

        MDBoxLayout:
            orientation: 'horizontal'
            spacing: "40dp"
            adaptive_size: True
            pos_hint: {"center_x": .5}
            size_hint_y: None
            height: "120dp"

            # Gato Preto
            MDBoxLayout:
                orientation: 'vertical'
                spacing: "10dp"
                adaptive_size: True

                MDFloatingActionButton:
                    icon: "cat"
                    md_bg_color: 0.1, 0.1, 0.1, 1
                    on_release: app.show_cat_popup("🐈‍⬛ Gato Preto")
                    size_hint: None, None
                    size: "80dp", "80dp"

                MDLabel:
                    text: "Preto"
                    halign: "center"
                    theme_text_color: "Secondary"
                    size_hint_y: None
                    height: "30dp"

            # Gato Branco
            MDBoxLayout:
                orientation: 'vertical'
                spacing: "10dp"
                adaptive_size: True

                MDFloatingActionButton:
                    icon: "cat"
                    md_bg_color: 0.9, 0.9, 0.9, 1
                    icon_color: 0.1, 0.1, 0.1, 1
                    on_release: app.show_cat_popup("🐈 Gato Branco")
                    size_hint: None, None
                    size: "80dp", "80dp"

                MDLabel:
                    text: "Branco"
                    halign: "center"
                    theme_text_color: "Secondary"
                    size_hint_y: None
                    height: "30dp"

    # Rodapé
    MDLabel:
        text: "by Nykollas Guimarães"
        halign: "right"
        size_hint_y: None
        height: "40dp"
        padding: "15dp", "15dp"
        theme_text_color: "Hint"
        font_style: "Caption"

    # Console F8 (Sobreposto)
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
                rgba: 0.05, 0.05, 0.05, 0.95
            Rectangle:
                pos: self.pos
                size: self.size
        
        MDLabel:
            text: "🖥️ Terminal (F8 para fechar)"
            theme_text_color: "Custom"
            text_color: 0.0, 1.0, 0.0, 1
            font_style: "Caption"
            size_hint_y: None
            height: "20dp"

        ScrollView:
            MDLabel:
                id: console_output
                text: app.console_logs
                theme_text_color: "Custom"
                text_color: 0.0, 1.0, 0.0, 1
                size_hint_y: None
                height: self.texture_size[1]
                valign: "top"
                markup: True

        MDTextField:
            id: console_input
            hint_text: "/quit, /clear, /viewLog"
            line_color_focus: 0.0, 1.0, 0.0, 1
            text_color_focus: 0.0, 1.0, 0.0, 1
            on_text_validate: app.process_command(self.text); self.text = ""
            size_hint_y: None
            height: "40dp"
'''

class GatoApp(MDApp):
    """Aplicação principal do App dos Gatos"""
    
    console_logs = StringProperty("")
    
    def build(self):
        """Inicializa a aplicação"""
        # Configurar tema
        self.theme_cls.primary_palette = "DeepPurple"
        self.theme_cls.theme_style = "Light"
        self.dialog = None
        
        # Carregar interface KV
        screen = Builder.load_string(KV)
        
        # Registrar eventos de teclado
        Window.bind(on_key_down=self.on_keyboard_down)
        
        # Agendar inicialização do console após a tela estar pronta
        Clock.schedule_once(self._init_console, 0.1)
        
        self.add_log("✅ App Iniciado com sucesso!")
        self.add_log("🎨 Tema: Claro")
        self.add_log("⌨️  Pressione F8 para abrir o console")
        
        return screen
    
    def _init_console(self, dt):
        """Inicializa o console após a tela estar pronta"""
        if self.root and 'console_input' in self.root.ids:
            self.add_log("🖥️ Console pronto para usar")

    def toggle_theme(self):
        """Alterna entre tema claro e escuro"""
        old_theme = self.theme_cls.theme_style
        new_theme = "Dark" if old_theme == "Light" else "Light"
        self.theme_cls.theme_style = new_theme
        self.add_log(f"🎨 Tema alterado para: {new_theme}")

    def add_log(self, message):
        """Adiciona uma mensagem ao console com timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.console_logs += f"[{timestamp}] {message}\n"

    def show_cat_popup(self, cat_name):
        """Exibe um popup com informações do gato"""
        self.add_log(f"🐱 Selecionado: {cat_name}")
        
        descriptions = {
            "🐈‍⬛ Gato Preto": "Um gatinho misterioso e elegante, pronto para trazer sorte!",
            "🐈 Gato Branco": "Puro como a neve, este gatinho é o companheiro perfeito.",
        }
        
        description = descriptions.get(cat_name, "Um gatinho adorável!")
        
        self.dialog = MDDialog(
            title=cat_name,
            text=description,
            buttons=[
                MDRaisedButton(
                    text="FECHAR",
                    on_release=lambda x: self.dialog.dismiss()
                )
            ],
        )
        self.dialog.open()

    def on_keyboard_down(self, window, key, scancode, codepoint, modifier):
        """Processa eventos de teclado"""
        if key == 289:  # F8
            if self.root and 'dev_console' in self.root.ids:
                console = self.root.ids.dev_console
                if console.disabled:
                    console.disabled = False
                    console.opacity = 1
                    if 'console_input' in self.root.ids:
                        self.root.ids.console_input.focus = True
                    self.add_log("✅ Console Aberto")
                else:
                    console.disabled = True
                    console.opacity = 0
                    self.add_log("❌ Console Fechado")
                return True
        return False

    def process_command(self, command):
        """Processa comandos do console"""
        cmd = command.strip().lower()
        self.add_log(f"> {cmd}")
        
        if cmd == "/quit":
            self.add_log("👋 Encerrando aplicação...")
            self.stop()
        elif cmd == "/clear":
            self.console_logs = ""
            self.add_log("🧹 Console limpo")
        elif cmd == "/viewlog":
            self.add_log("📋 Histórico de logs:")
            self.add_log(self.console_logs)
        elif cmd == "/help":
            self.add_log("📖 Comandos disponíveis:")
            self.add_log("  /quit - Encerra o app")
            self.add_log("  /clear - Limpa o console")
            self.add_log("  /viewlog - Mostra histórico")
            self.add_log("  /help - Mostra esta mensagem")
        else:
            self.add_log(f"❌ Comando desconhecido: {cmd}")
            self.add_log("💡 Digite /help para ver comandos disponíveis")

if __name__ == "__main__":
    GatoApp().run()
