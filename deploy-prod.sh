now="$(date +'%Y-%m-%d %H:%M:%S')"
message="update $now"
git add .
git commit -m "$message"
git push

ssh root@170.64.198.10 "
    cd /opt/luanlt/back-end/; 
    rm -rf cdn.wincrypto.ai;
    git clone -b main --single-branch https://github.com/WinCrypto-AI/cdn.git cdn.wincrypto.ai; 
    cd cdn.wincrypto.ai/;
    cp .env.example .env;
    yarn; 
    pnpm start:prod; 
    exit;
"
