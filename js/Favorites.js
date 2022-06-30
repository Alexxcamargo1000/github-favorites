import {GithubUser} from './GithubUser.js'

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  async add(userName) {
    try {
      const user = await GithubUser.findUser(userName);
      const userExisted = this.entries.find((user) => user.login === userName);


      if(userName === '') {
        throw new Error("O nome do usuário não pode ser vazio ")
      }
      if (userExisted) {
        throw new Error("Usuário já existe")
      }
      if( user.login === undefined) {
        throw new Error("Usuário não encontrado")
      }
      

      this.entries = [...this.entries, user];

      this.update();
      this.save();
      
    } catch (error) {
      alert(error)
    }

  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github:")) || [];
  }

  save() {
    localStorage.setItem("@github:", JSON.stringify(this.entries));
  }

  delete(user) {
    
    const entriesFiltered = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    confirm("Quer deletar esse usuário ? ") 
      ? this.entries = entriesFiltered 
      : this.entries
   
    this.update();
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("tbody");
    this.update();
    this.onAdd();
  }

  onAdd() {
    const buttonFavorites = this.root.querySelector("button");

    buttonFavorites.onclick = () => {
      const { value } = this.root.querySelector("input");
      this.add(value);
    };

  }

  update() {
    this.removeAllTr();

    if(this.entries.length === 0 ){
      const row = this.createRowEmpty();
      this.tbody.append(row);
      return;
    }

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector("img").src = user.avatar_url;
      row.querySelector("strong").innerHTML = user.name;
      row.querySelector("a").innerHTML = user.login;
      row.querySelector("a").href = user.html_url;
      row.querySelector(".repositories").innerHTML = user.public_repos;
      row.querySelector(".followers").innerHTML = user.followers;
      row.querySelector("button").onclick = () => {
        //row.remove();
        this.delete(user);
      };
      this.tbody.append(row);
    });
   
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="user">
          <img src="https://Github.com/diego3g.png" alt="" />
          <div class="userName">
            <strong>Mark brito</strong>
            <a href="#" target="_blank">/diego3g</a>
          </div>
        </div>
      </td>
      <td>
        <span class="repositories">123</span>
      </td>
      <td>
        <span class="followers">1234</span>
      </td>
      <td>
        <button>Remover</button>
      </td>
    `;

    return tr;
  }

  createRowEmpty() {
    const tr = document.createElement("tr");
    tr.classList.add("empty");
    tr.innerHTML = `
      <td colspan="4">
        <div class="content">
          <svg
          width="132"
          height="125"
          viewBox="0 0 132 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M106.917 86.7188C106.257 82.8938 107.538 78.9937 110.356 76.2875L128.381 58.9562C135.469 52.1375 131.555 40.2563 121.761 38.85L96.8522 35.2813C92.9581 34.725 89.5921 32.3125 87.8562 28.8313L76.7153 6.56872C74.524 2.18747 70.2604 0 65.9967 0C61.7396 0 57.476 2.18747 55.2847 6.56872L44.1438 28.8313C42.408 32.3125 39.0419 34.725 35.1478 35.2813L10.2391 38.85C0.444538 40.2563 -3.46934 52.1375 3.61917 58.9562L21.644 76.2875C24.4623 78.9937 25.7427 82.8938 25.0827 86.7188L20.8256 111.194C19.499 118.812 25.6371 125 32.6002 125C34.435 125 36.3293 124.569 38.1641 123.619L60.4394 112.062C62.1819 111.162 64.0893 110.713 65.9967 110.713C67.9107 110.713 69.8182 111.162 71.5606 112.062L93.8359 123.619C95.6708 124.569 97.565 125 99.3998 125C106.363 125 112.501 118.812 111.174 111.194L106.917 86.7188ZM66.0219 60.984H70.7119V42.6376H66.0219V60.984ZM57.1356 60.984H61.8256V42.6376H57.1356V60.984ZM64.8083 91.0294H66.2276C68.5178 91.0294 70.5611 90.7158 72.3576 90.0886C74.1677 89.475 75.7105 88.6023 76.9858 87.4706C78.2612 86.3525 79.2348 85.0162 79.9068 83.4618C80.5788 81.921 80.9147 80.2098 80.9147 78.3281C80.9147 76.4601 80.5788 74.7488 79.9068 73.1944C79.2348 71.6536 78.2612 70.3173 76.9858 69.1856C75.7105 68.0675 74.1677 67.2017 72.3576 66.5881C70.5611 65.9745 68.5178 65.6677 66.2276 65.6677H64.8083C62.5319 65.6677 60.4886 65.9745 58.6784 66.5881C56.8682 67.2153 55.3255 68.0948 54.0501 69.2265C52.7885 70.3583 51.8217 71.6945 51.1497 73.2353C50.4778 74.7897 50.1418 76.501 50.1418 78.369C50.1418 80.2507 50.4778 81.9619 51.1497 83.5027C51.8217 85.0571 52.7885 86.3934 54.0501 87.5115C55.3255 88.6296 56.8682 89.4954 58.6784 90.109C60.4886 90.7226 62.5319 91.0294 64.8083 91.0294ZM66.2688 84.8321H64.8083C63.2313 84.8321 61.8325 84.689 60.612 84.4026C59.4052 84.1163 58.3836 83.7004 57.547 83.155C56.7242 82.6096 56.1003 81.9346 55.6752 81.1302C55.25 80.3257 55.0375 79.4053 55.0375 78.369C55.0375 77.3327 55.25 76.4123 55.6752 75.6078C56.1003 74.8034 56.7242 74.1216 57.547 73.5626C58.3836 73.0035 59.4052 72.5808 60.612 72.2945C61.8325 72.0081 63.2313 71.865 64.8083 71.865H66.2688C67.8595 71.865 69.2583 72.0081 70.4651 72.2945C71.6719 72.5808 72.6867 72.9967 73.5095 73.5421C74.3323 74.1012 74.9494 74.7761 75.3608 75.5669C75.7859 76.3714 75.9985 77.2918 75.9985 78.3281C75.9985 79.3644 75.7859 80.2848 75.3608 81.0892C74.9494 81.8937 74.3323 82.5755 73.5095 83.1346C72.6867 83.6936 71.6719 84.1163 70.4651 84.4026C69.2583 84.689 67.8595 84.8321 66.2688 84.8321Z"
            fill="#4E5455"
          />
        </svg>
        <span>Nenhum favorito ainda</span>
        </div>
       </td>
    ` 
    return tr;
  }
}
