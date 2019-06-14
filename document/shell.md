# Linux/Mac/Shell常用命令

> 工欲善其事，必先利其器。无论是做哪一方面开发的程序员，都免不了和shell打交道，不管是基于Linux的服务器、开发机，还是Mac。
本文主要记录一些Shell命令的基本用法，作为参考/查询手册，随时更新、完善。更多技巧以及详细解释将后续以专题形式持续更新。
常用命令

    ls 查看当前目录下的文件
    cd 进入某目录
    cd - 跳转回前一目录
    cd ~ 进入当前用户个人目录
    pwd 输出当前所在路径
    mkdir 新建文件夹
    touch 新建文件
    find 查找文件
    ln 建立链接
    du 查看目录大小
    du -sh * 带有单位显示目录信息
    df 查看磁盘大小
    df -h 带有单位显示磁盘信息
    cal 显示日历
    date 显示当前日期、时间

## 文件传输类

    mv 移动文件/重命名
    cp [File Name] [Destination] 拷贝文件
    cp -R [File Name] [Destination]递归拷贝（主要用于文件夹）
    scp 远程拷贝，除了需要在远程地址的目录前加入user@host:形式的地址信息外，命令用法与copy一致
    ftp 启动ftp服务。

## 压缩与解压缩

    tar 打包压缩

         `-c` 归档文件
         `-x` 解压缩文件
         `-v` 显示压缩/解压缩过程
         `-j` bzip2压缩文件
         `-z` gzip压缩文件
         `-f` 使用档名

    tar -cvf 只打包，不压缩
    tar -zcvf 打包，并用gzip压缩
    tar -jcvf 打包，并用bzip2压缩
    解压缩时，只需将上述命令中c换成x即可。

## 系统命令类

    whoami 显示当前操作用户
    hostname 显示主机名
    uname 显示系统信息
    top 动态显示当前耗费资源最多进程信息
    ps 显示瞬间进程状态 ps aux
    kill 杀死进程（top/ps查看进程id后，kill [id]）
    netstat显示网络状态信息
    which [command] 查看命令所在路径
    export [VAR]="xxx"为系统变量赋值
    alias [short]=[long] 为命令设定别名

## 文本操作类

这是比较重要的一节，后面会专门写文章介绍这些概念，这里只作为一个目录。

    cat 查看文件内容
    head 查看文件头部内容
    tail 查看文件尾部内容
    more/less分页显示文件内容
    grep 在文本文件中查找某个字符串
    | 管道
    > >> 重定向

## 包管理(ubuntu)

此处主要介绍ubuntu包管理概念，大多数Mac用户使用Brew，原理类似，具体命令参考帮助文档即可。

sudo apt-get update 更新软件源信息
sudo apt-get upgrade 更新已安装的包
sudo apt-get dist-upgrade 升级系统（慎重！！！）
sudo apt-get install 安装软件
sudo apt-get -f install   修复安装
sudo apt-get remove 删除软件
sudo apt-get remove --purge 删除软件以及配置文件
sudo apt-get autoremove 自动删除（未删除的依赖）
sudo apt-get clean && sudo apt-get autoclean 清理无用的包

## 权限管理

    chmod 更改权限
    chown 更改文件的用户及用户组
