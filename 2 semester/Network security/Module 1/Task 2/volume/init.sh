#!/bin/bash

# Устанавливаем пароль пользователя
USERNAME="astepanov"
PASSWORD="your_secure_password"

# Обновляем пакеты и устанавливаем sudo
apt update
apt install -y sudo

# Создаем пользователя и задаем пароль
useradd -m -s /bin/bash "$USERNAME"
echo "$USERNAME:$PASSWORD" | chpasswd

# Добавляем пользователя в группу sudo
usermod -aG sudo "$USERNAME"

# Переключаемся на пользователя (в новой оболочке)
echo "Теперь войдите как $USERNAME с паролем $PASSWORD"
su - "$USERNAME"
