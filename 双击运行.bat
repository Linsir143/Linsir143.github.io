@echo off
chcp 65001 > nul
title Γ 的个人网站 - 本地服务器
python start.py
if %errorlevel% neq 0 (
    echo.
    echo [错误] 启动失败！请确保 Python 已正确安装并已添加到系统环境变量 (PATH) 中。
    echo.
    pause
)
