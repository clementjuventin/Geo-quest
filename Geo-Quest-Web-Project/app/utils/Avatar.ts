import Assets from "../assets/Assets";

export const getAvatarFromUsername = function (username: string) {
    var hash = 0,
        i, chr;
    if (username.length === 0) return Assets.avatars[0];
    for (i = 0; i < username.length; i++) {
        chr = username.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    const avatar = Assets.avatars[hash % Assets.avatars.length]

    return avatar;
}