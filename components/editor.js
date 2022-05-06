import { useState, useEffect } from "react";
import { text } from "../lib/data";
import rehypeSanitize from "rehype-sanitize";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
// -----------------------------------------------------------
// NEXT.JS configuration for @uiw
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    {
        loading: () => <p>{text.editor.loading}</p>,
        ssr: false
    },
);
// ------------------------------------------------------------ 
export default function Editor({ postBody, handleData }) {
    const [value, setValue] = useState()
    const router = useRouter()
    const [unsavedChanges, setUnsavedChanges] = useState();
    const [mounted, setMounted] = useState(false)
    const {resolvedTheme} = useTheme()

    useEffect(() => setValue(postBody), [postBody])

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const confirmationMessage = `${text.editor.youHaveUnpublished}`;
        const beforeUnloadHandler = (e) => {
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
        };
        const beforeRouteHandler = (url) => {
            if (router.pathname !== url && !confirm(confirmationMessage)) {
                // to inform NProgress or something ...
                router.events.emit('routeChangeError');
                // tslint:disable-next-line: no-string-throw
                throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
            }
        };
        if (unsavedChanges) {
            window.addEventListener('beforeunload', beforeUnloadHandler);
            router.events.on('routeChangeStart', beforeRouteHandler);
        } else {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            router.events.off('routeChangeStart', beforeRouteHandler);
        }
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            router.events.off('routeChangeStart', beforeRouteHandler);
        };
    }, [unsavedChanges, router]);
    

    const handleChange = (e) => {
        setUnsavedChanges(true)
        setValue(e)
        handleData(e)
        return;
    }

    return (
        <div data-color-mode={resolvedTheme}>
            <MDEditor 
            className="editor"
            value={value} 
            onChange={handleChange} 
            textareaProps={{ spellCheck: true }}
            previewOptions={{rehypePlugins: [[rehypeSanitize]]}}
            autoFocus={true}
            />
        </div>
    )
}