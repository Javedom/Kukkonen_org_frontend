export function initCVAccordion() {
    const cvCard = document.getElementById('cv-card-intoit');
    if (!cvCard) return;

    const content = cvCard.querySelector('.accordion-content');
    const toggleText = document.getElementById('cv-toggle-text');
    const icon = toggleText?.querySelector('i');

    cvCard.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('.tech-tag')) return;

        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        if (isOpen) {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
            content.style.marginTop = '0';
            content.style.paddingTop = '0';
            if(toggleText) toggleText.firstChild.nodeValue = "Lue lisää ";
            if(icon) icon.style.transform = 'rotate(0deg)';
            
            const headerOffset = 100;
            const elementPosition = cvCard.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
            content.style.maxHeight = (content.scrollHeight + 50) + "px";
            content.style.opacity = '1';
            content.style.marginTop = '1.5rem';
            content.style.paddingTop = '1.5rem';
            if(toggleText) toggleText.firstChild.nodeValue = "Pienennä ";
            if(icon) icon.style.transform = 'rotate(180deg)';
        }
    });

    window.addEventListener('resize', () => {
        if (content.style.maxHeight && content.style.maxHeight !== '0px') {
            content.style.maxHeight = (content.scrollHeight + 50) + "px";
        }
    });
}