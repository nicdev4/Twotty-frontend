export interface IUser{
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
}

export class ConfigData{
  public server_uri = "";
}
export class User implements IUser{
  first_name: string = "";
  id: number = 0;
  last_name: string = "";
  photo_url: string = "";
  username: string = "";

  getPhotoUrl(server_uri: string){
    return server_uri+this.photo_url;
  }
}

export class Twots{
  twots: Twot[]|undefined;
}

export interface ITwot{
  id: number;
  user: IUser;
  text: string;
  date: string;
}

export class Twot{
  id: number = 0;
  user: User = new User();
  text: string = "";
  date: string = "";
}

export class Err{
  public enabled = false;
  public text = "";
}
