document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-target.fade').forEach((el) => {
        window.setTimeout(() => el.classList.remove('fade'), 230);
    });
});

document.addEventListener('change', (e) => {
    const check = e.target;
    if (!(check instanceof HTMLInputElement) || !check.classList.contains('check')) return;
    const menu = check.closest('.menu, .menu2');
    if (!menu) return;
    const open = check.checked;
    menu.classList.toggle('is-open', open);
    check.setAttribute('aria-expanded', String(open));
    const barras = menu.querySelector('.barras');
    if (barras) {
        const src = barras.getAttribute('src') || '';
        barras.setAttribute(
            'src',
            open
                ? src.replace(/menu\.svg(\?.*)?$/, 'close.svg$1')
                : src.replace(/close\.svg(\?.*)?$/, 'menu.svg$1')
        );
    }
});
