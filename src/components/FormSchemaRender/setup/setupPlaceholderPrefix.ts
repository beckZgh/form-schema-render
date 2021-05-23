export const placeholderPrefixMap = new Map<string, string>();

// 外部覆盖或提供默认值
export default function setupPlaceholderPrefix(config: { [k: string]: string }) {
    Object.keys(config).forEach((k) => {
        placeholderPrefixMap.set(k, config[k]);
    });
}
