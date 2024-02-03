<template>
  <v-container class="competition-edit-container white--text" ma-0 pa-0 fluid>
    <div class="text-center">
      <v-btn color="white" @click="downloadMockedFile">
        Отримати тестовий Doc-file
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { Document, Packer, PageOrientation } from "docx";
import { DATA_TO_DOC_PAGES } from '../protocols/defaultUtils';
import { tableData as pages } from '../protocols/mockedPages';

export default {
  data: function () {
    return {
      competitionData: null,
      doc: null,
    }
  },
  mounted() {
    window.pages = pages;
    //this.downloadMockedFile();
  },
  methods: {
    downloadMockedFile() {
      this.doc = new Document({
        sections: [
            {
              properties: {
                  page: {
                    size: {
                      orientation: PageOrientation.LANDSCAPE,
                    }
                  },
              },
              children: DATA_TO_DOC_PAGES(window.pages),
            },
          ],
      });
      // Used to export the file into a .docx file
      Packer.toBlob(this.doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "DocumentWithPageBreak.docx";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  }
}
</script>