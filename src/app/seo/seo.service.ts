import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private titleService: Title, private metaService: Meta) {}

  updateSeo({
    title,
    description,
    keywords,
    index,
    follow,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    structuredData,
  }: {
    title: string;
    description: string;
    keywords: string[];
    index: boolean;
    follow: boolean;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    structuredData: any;
  }) {
    this.updateTitle(title);
    this.updateDescription(description);
    this.updateKeywords(keywords);
    this.setIndexFollowStatus(index, follow);
    this.updateOpenGraphTags(ogTitle, ogDescription, ogImage, ogUrl);
    this.updateStructuredData(structuredData);
  }

  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateDescription(description: string) {
    this.metaService.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string[]) {
    this.metaService.updateTag({
      name: 'keywords',
      content: keywords.join(', '),
    });
  }

  setIndexFollowStatus(index: boolean, follow: boolean) {
    this.metaService.updateTag({
      name: 'robots',
      content: `${index ? 'index' : 'noindex'}, ${
        follow ? 'follow' : 'nofollow'
      }`,
    });
  }

  updateOpenGraphTags(
    title: string,
    description: string,
    image: string,
    url: string
  ) {
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
  }

  updateStructuredData(data: any) {
    this.metaService.addTag({ name: 'application-name', content: 'My App' });
    this.metaService.addTag({ itemprop: 'name', content: data.name });
    this.metaService.addTag({
      itemprop: 'description',
      content: data.description,
    });
    this.metaService.addTag({ itemprop: 'image', content: data.image });
  }
}
