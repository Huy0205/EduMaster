// app/kiemtra/layout.js
import { OntapProvider } from '~/context/OntapContext';

export default function OntapLayout({ children }) {
    return (
        <OntapProvider>
            <div>
                <main>{children}</main>
            </div>
        </OntapProvider>
    );
}
