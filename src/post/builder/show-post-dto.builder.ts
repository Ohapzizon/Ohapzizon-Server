import { ShowPostDto } from '../dto/show-post.dto';
import { Builder } from '../../common/builder/builder';
import { IBuilder } from '../../common/builder/types/builder.type';

export class ShowPostDtoBuilder
  extends Builder<ShowPostDto>
  implements IBuilder<ShowPostDto>
{
  constructor() {
    super(ShowPostDto);
  }

  setIdx(arg: ShowPostDto['idx']) {
    this.object.idx = arg;
    return this;
  }

  setTitle(arg: ShowPostDto['title']) {
    this.object.title = arg;
    return this;
  }

  setContents(arg: ShowPostDto['contents']) {
    this.object.contents = arg;
    return this;
  }

  setMaxCount(arg: ShowPostDto['maxCount']) {
    this.object.maxCount = arg;
    return this;
  }

  setMealTime(arg: ShowPostDto['mealTime']) {
    this.object.mealTime = arg;
    return this;
  }

  setWriter(arg: ShowPostDto['writer']) {
    this.object.writer = arg;
    return this;
  }
}
