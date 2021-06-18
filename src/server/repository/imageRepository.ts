import { EntityRepository, Repository } from "typeorm";
import Image from "../entity/Image";

@EntityRepository(Image)
class ImageRepository extends Repository<Image>{
  createAndSave(path: string, fileName: string){
    const image = this.create({path, fileName});
    return this.save(image);
  }
}

export default ImageRepository;