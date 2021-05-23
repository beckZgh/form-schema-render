const ID_PREFIX = '_field_';

export function useId() {
    let id_count = 0;

    /** 重置 id 统计 */
    const resetId = () => {
        id_count = 0;
    };

    /** 获取当前 id 统计 */
    const genId = () => {
        return `${ID_PREFIX}${++id_count}`;
    };

    return { resetId, genId };
}
