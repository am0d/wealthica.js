declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv {
                IA_USERNAME: string;
                IA_PASSWORD: string;
            }
        }
    }
}
