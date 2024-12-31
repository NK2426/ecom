// src/app/camel-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCase'
})
export class CamelCasePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;
    
        // Split the string into words assuming words are separated by spaces, underscores, or hyphens
        const words = value.split(/[\s_-]+/);
    
        // Capitalize the first letter of the first word
        if (words.length > 0) {
          words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        }
    
        // Capitalize the first letter of the second word if it exists
        if (words.length > 1) {
          words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
        }
    
        // Join the words back into a single string
        return words.join(' ');
      }
}
