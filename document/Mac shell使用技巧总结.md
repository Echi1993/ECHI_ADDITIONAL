# Mac shell使用技巧总结

## 文件操作

- 常用目录

      /Systme/Library/Extensions        // 驱动所在目录
      /User/XXX/Desktop                 // 桌面目录

- 资源库

      chflags nohidden ~/Library/        // 显示资源库
      chflags hidden ~/Library/          // 隐藏资源库

- 目录

| 命令名 | 功能描述 | 使用举例
| - | - | -
| mkdir | 创建一个目录 | mkdir XXX
| rmdir | 删除一个目录 | rmdir XXX
| mvdir | 移动或重命名一个目录 | mvdir XXX XXX
| cd | 进入目录 | cd XXX
| cd .. | 回到上一目录 | cd ..
| cd ~ | 回到用户根目录 | cd ~
| pwd | 显示当前目录的路径名 | pwd
| ls | 显示当前目录的内容 | ls -al
| open | 打开当前目录 | open .

- 文件操作

| 命令名 | 功能描述 | 使用举例
| - | - | -
| cat  | 显示或连接文件  | cat XXX
| od  | 显示非文本文件的内容  | od -c XXX
| cp  | 复制文件或目录  | cp XXX XXX
| rm  | 删除文件或目录  | rm XXX
| rm -rf  | 强制删除文件或目录(慎用)  | rm -rf XXX
| mv  | 移动文件到新路径  | mv XXX XXX
| find  | 使用匹配表达式查找文件  | find . -name "*.c" -print
| file  | 显示文件类型  | file XXX

- 选择操作

| 命令名 | 功能描述 | 使用举例
| - | - | -
| head  | 显示文件的最初几行  | head -20 XXX
| tail  | 显示文件的最后几行  | tail -15 XXX
| cut  | 显示文件每行中的某些域  | cut -f1,7 -d: /etc/passwd
| colrm  | 从标准输入中删除若干列  | colrm 8 20 XXX
| diff  | 比较并显示两个文件的差异  | diff XXX XXX
| sort  | 排序或归并文件  | sort -d -f -u XXX
| uniq  | 去掉文件中的重复行  | uniq XXX XXX
| comm  | 显示两有序文件的公共和非公共行  | comm XXX XXX
| wc  | 统计文件的字符数、词数和行数  | wc XXX
| nl  | 给文件加上行号  | nl XXX >XXX

- 文件编辑

    touch abc.txt   // 创建 abc.txt 文件
    vim abc.txt     // vim编辑 abc.txt 
    :wq             // vim保存并退出
    :x              // vim直接退出
    nano abc.txt    // nano编辑 abc.txt

> 将文件转成 HTML，支持格式包括 Text, .RTF, .DOC.
  
    textutil -convert html file.extension

## 系统操作

- 进程操作

| 命令名 | 功能描述 | 使用举例
| - | - | -
| ps  | 显示进程当前状态  | ps u
| kill  | 终止进程  | kill -9 30142

- 时间操作

| 命令名 | 功能描述 | 使用举例
| - | - | -
| date  | 显示系统的当前日期和时间  | date
| cal  | 显示日历  | cal 4 2016
| time  | 统计程序的执行时间  | time a.out

- 启动与退出

      shutdown - r now      // 重启 Mac OS X
      shutdown now          // 关闭 Mac OS X

- 电源管理

      pmset -g                      // 获取当前电源管理设置的信息
      sudo pmset displaysleep 15    // 设置显示器无活动15分钟后关闭
      sudo pmset sleep 30           // 让计算机在无活动30分钟后休眠

- 外观

      // 禁用仪表盘
      defaults write com.apple.dashboard mcx-disabled -boolean YES
      // 启用仪表盘
      defaults write com.apple.dashboard mcx-disabled -boolean NO

- 隐藏文件显影

      // 终端输入后重启Finder即可
      defaults write com.apple.finder AppleShowAllFiles -bool true // 显示
      defaults write com.apple.finder AppleShowAllFiles -bool false // 隐藏

- .DS_Store文件处理

      // 禁止.DS_Store文件生成
      defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE 
      // 恢复.DS_Store文件生成
      defaults delete com.apple.desktopservices DSDontWriteNetworkStores
      // 删除所有.DS_Store文件 
      sudo find / -name ".DS_Store" -depth -exec rm {} \;

- iTunes

      // 更改 iTunes 链接行为为本机 iTunes 库，而不是 iTunes Store
      defaults write com.apple.iTunes invertStoreLinks -bool YES  
      // 更改 iTunes 链接行为为 iTunes Store，而不是本机 iTunes 库
      defaults write com.apple.iTunes invertStoreLinks -bool NO

- 改变截屏图片的保存位置

      defaults write com.apple.screencapture location XXX   // XXX为存放位置

- 去掉窗口截屏的阴影

      defaults write com.apple.screencapture disable-shadow -bool true

- 强制Safari在新标签中打开网页

      defaults write com.apple.Safari TargetedClicksCreateTabs -bool true

## 网络操作

- 网络与通信操作

| 命令名 | 功能描述 | 使用举例
| - | - | -
| telnet  | 远程登录  | telnet hpc.sp.net.edu.cn
| rlogin  | 远程登录  | rlogin hostname -l username
| rsh  | 在远程主机执行指定命令  | rsh f01n03 date
| ftp  | 在本地主机与远程主机之间传输文件  | ftp.sp.net.edu.cn
| rcp  | 在本地主机与远程主机之间复制文件  | rcp file1 host1:file2
| mail  | 阅读和发送电子邮件  | mail
| write  | 给另一用户发送报文  | write username pts/1
| mesg  | 允许或拒绝接收报文  | mesg n
| ping  | 给一个网络主机发送回应请求  | ping hpc.sp.net.edu.cn

- 检测某个主机是否运行HTTP服务或网络是否可用

      curl -I www.baidu.com | head -n 1

- 使用 dig 来诊断域名信息

      dig www.oschina.net A
      dig www.oschina.net MX

- 查看网络及相关信息

      netstat -r        // 显示系统路由表
      netstat -an       // 显示活动网络连接
      netstat -s        // 显示网络统计

## 其他常用

    history            // 查看终端输入历史
    clear              // 清空bash输入框

- 结束进程

      killall Finder                        // 重启Finder
      killall Dock                          // 重启Dock
      defaults delete com.apple.dock        // 重置系统Dock
      killall SystemUIServer                // 结束进程

- 其他命令

| 命令名 | 功能描述 | 使用举例
| - | - | -
| uname  | 显示操作系统的有关信息  | uname -a
| clear  | 清除屏幕或窗口内容  | clear
| alias  | 给某个命令定义别名  | alias del=rm -i
| unalias  | 取消对某个别名的定义  | unalias del
| who  | 显示当前所有设置过的环境变量  | who
| whoami  | 显示当前正进行操作的用户名  | whoami
| tty  | 显示终端或伪终端的名称  | tty
| du  | 查询磁盘使用情况  | du -k subdir
| stty  | 显示或重置控制键定义  | stty -a
| df/tmp  | 显示文件系统的总空间和可用空间  | -
w  | 显示当前系统活动的总信息  | -

## 查询操作

- find命令

      unix命令，试用于OS X和Linux，格式为 find 文件路径 参数

      // 在当前路径下搜索名字中包含`.md`的文件
      find ~ -iname  "*.md"
      // 在特定的路径下搜索特定的文件
      find SilverBulletZyp.github.io/_posts "*.md"

- mdfind命令

      Spotlight功能的终端界面，若Spotlight功能被禁用，则mdfind也无法工作，mdfind命令非常高效迅速

> 格式为 mdfind -name 文件名字

      // 搜索本地所有的.md文件
      mdfind -name ".md"
      // 搜索本地名为fenxiang@2x文件位置
      mdfind -name fenxiang@2x
      // 搜索本地所有包含该字段的文件
      mdfind "请输入密码"
      // 添加-onlyin参数搜索指定目录指定文件或文件字段
      mdfind -onlyin ~/company/ "请输入密码"
      mdfind -onlyin ~/company/ plist

