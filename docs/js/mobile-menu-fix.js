// モバイルメニュー専用の修正スクリプト
document.addEventListener('DOMContentLoaded', function() {
    // 要素を取得
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (!mobileMenuToggle || !mainNav) {
        console.error('モバイルメニュー要素が見つかりません');
        return;
    }
    
    // シンプルなクリックハンドラー
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // メニューの開閉
        mainNav.classList.toggle('active');
        
        // アイコンの切り替え
        const icon = this.querySelector('i');
        if (icon) {
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // メニュー外クリックで閉じる
    document.addEventListener('click', function(e) {
        if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // リンククリック時にメニューを閉じる
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    console.log('モバイルメニュー修正スクリプトが正常に読み込まれました');
});
