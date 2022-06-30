export class GithubUser {
  static async findUser(userName) {
    const URL_GITHUB = `https://api.github.com/users/${userName}`;

    const data = await fetch(URL_GITHUB);
    const { login, avatar_url, name, followers, public_repos, html_url } =
      await data.json();
    return {
      login,
      avatar_url,
      name,
      followers,
      public_repos,
      html_url,
    };
  }
}